import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiService {
    constructor(private Client: PrismaService) {}

    // IMAGES
    async getImages(category?: string) {
        return this.Client.image.findMany({
            where: category ? { category } : undefined,
        });
    }

    async getImageById(id: number) {
        const image = await this.Client.image.findUnique({ where: { id } });
        if (!image) throw new NotFoundException('Image not found');
        return image;
    }

    // USERS
    async createUser(email: string) {
        const existing = await this.Client.user.findUnique({ where: { email } });
        if (existing) throw new ConflictException('Email already exists');
        return this.Client.user.create({ data: { email } });
    }

    // EVENTS
    async createEvent(userId: number, imageId: number, dwellSeconds: number) {
        if (dwellSeconds < 5) {
            return { saved: false, message: 'View too short, not counted' };
        }

        const user = await this.Client.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const image = await this.Client.image.findUnique({ where: { id: imageId } });
        if (!image) throw new NotFoundException('Image not found');

        await this.Client.$transaction([
            this.Client.event.create({ data: { userId, imageId, dwellSeconds } }),
            this.Client.userInterest.upsert({
                where: { userId_category: { userId, category: image.category } },
                update: { score: { increment: dwellSeconds } },
                create: { userId, category: image.category, score: dwellSeconds },
            }),
        ]);

        return { saved: true };
    }

    // INTERESTS
    async getInterests(userId: number) {
        const user = await this.Client.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        return this.Client.userInterest.findMany({
            where: { userId },
            orderBy: { score: 'desc' },
            select: { category: true, score: true },
        });
    }

    // FEED
    async getFeed(userId: number) {
        const user = await this.Client.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const interests = await this.Client.userInterest.findMany({
            where: { userId },
            select: { category: true, score: true },
        });
        const scores = new Map(interests.map((i) => [i.category, i.score]));

        const images = await this.Client.image.findMany();
        return images.sort(
            (a, b) => (scores.get(b.category) ?? 0) - (scores.get(a.category) ?? 0),
        );
    }

    // ANALYTICS
    async topCategories() {
        const rows = await this.Client.$queryRaw<{ category: string; total: bigint }[]>`
      SELECT i."category", SUM(e."dwellSeconds") AS total
      FROM "Event" e
      JOIN "Image" i ON i."id" = e."imageId"
      GROUP BY i."category"
      ORDER BY total DESC`;
        return rows.map((r) => ({ category: r.category, totalSeconds: Number(r.total) }));
    }

    async viewsPerDay() {
        const rows = await this.Client.$queryRaw<{ day: Date; views: bigint }[]>`
      SELECT DATE("createdAt") AS day, COUNT(*) AS views
      FROM "Event"
      GROUP BY day
      ORDER BY day`;
        return rows.map((r) => ({ day: r.day, views: Number(r.views) }));
    }
}
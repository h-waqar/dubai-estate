"use server";

import { prisma } from "@/lib/prisma";

export interface DashboardStats {
    users: { total: number; newThisMonth: number };
    revenue: { total: number; newThisMonth: number };
    properties: {
        total: number;
        newThisMonth: number;
        approved: number;
        pending: number;
        declined: number;
    };
    projects: {
        total: number;
        approved: number;
        pending: number;
        declined: number;
    };
    developers: { total: number };
    posts: { total: number; newThisMonth: number };
    leads: { total: number; newThisMonth: number };
    recentActivity: ActivityItem[];
}

export interface ActivityItem {
    id: string;
    type: "USER" | "PROPERTY" | "POST" | "LEAD";
    message: string;
    createdAt: Date;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Helper to get count and new count
    const getBasicStat = async (model: any) => {
        const [total, newThisMonth] = await Promise.all([
            model.count(),
            model.count({
                where: {
                    createdAt: {
                        gte: firstDayOfMonth,
                    },
                },
            }),
        ]);
        return { total, newThisMonth };
    };

    // Helper for status counts
    const getStatusStat = async (model: any) => {
        const [total, newThisMonth, approved, pending, declined] = await Promise.all([
            model.count(),
            model.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
            model.count({ where: { status: "APPROVED" } }),
            model.count({ where: { status: "PENDING_REVIEW" } }),
            model.count({ where: { status: "DECLINED" } }),
        ]);
        return { total, newThisMonth, approved, pending, declined };
    };

    // 1. Fetch Stats in parallel
    const [users, properties, projects, developers, posts, leads, plansWithUserCount] = await Promise.all([
        getBasicStat(prisma.user),
        getStatusStat(prisma.property),
        getStatusStat(prisma.project),
        getBasicStat(prisma.developer),
        getBasicStat(prisma.post),
        getBasicStat(prisma.callbackRequest),
        prisma.pricingPlan.findMany({
            select: {
                priceMonthly: true,
                _count: {
                    select: { users: true }
                }
            }
        }),
    ]);

    const totalMonthlyRevenue = plansWithUserCount.reduce((acc, plan) => {
        return acc + (Number(plan.priceMonthly) * plan._count.users);
    }, 0);

    // For simplicity, we'll assume revenue this month is the same as total monthly revenue
    // unless we have a Transaction model to track precisely.
    const revenue = {
        total: totalMonthlyRevenue,
        newThisMonth: totalMonthlyRevenue // Placeholder until transaction history is implemented
    };

    // 2. Fetch Recent Activity (Limit 5 from each, then sort & slice)
    const [recentUsers, recentProperties, recentPosts, recentLeads] = await Promise.all([
        prisma.user.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            select: { id: true, name: true, createdAt: true }
        }),
        prisma.property.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            select: { id: true, title: true, createdAt: true }
        }),
        prisma.post.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            select: { id: true, title: true, createdAt: true }
        }),
        prisma.callbackRequest.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            select: { id: true, fullName: true, createdAt: true }
        }),
    ]);

    const activity: ActivityItem[] = [
        ...recentUsers.map(u => ({
            id: `user-${u.id}`,
            type: "USER" as const,
            message: `New user joined: ${u.name || 'Unknown'}`,
            createdAt: u.createdAt
        })),
        ...properties.total > 0 ? recentProperties.map(p => ({
            id: `prop-${p.id}`,
            type: "PROPERTY" as const,
            message: `New property listed: ${p.title}`,
            createdAt: p.createdAt
        })) : [],
        ...posts.total > 0 ? recentPosts.map(p => ({
            id: `post-${p.id}`,
            type: "POST" as const,
            message: `New blog post: ${p.title}`,
            createdAt: p.createdAt
        })) : [],
        ...leads.total > 0 ? recentLeads.map(l => ({
            id: `lead-${l.id}`,
            type: "LEAD" as const,
            message: `New lead: ${l.fullName}`,
            createdAt: l.createdAt
        })) : [],
    ]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

    return {
        users,
        revenue,
        properties,
        projects: {
            total: projects.total,
            approved: projects.approved,
            pending: projects.pending,
            declined: projects.declined
        },
        developers: { total: developers.total },
        posts,
        leads,
        recentActivity: activity,
    };
}

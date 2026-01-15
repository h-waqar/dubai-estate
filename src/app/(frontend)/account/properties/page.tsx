import { listProperties } from "@/modules/property/services/listProperties";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit2, Eye, MapPin } from "lucide-react";

export default async function MyPropertiesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const { data: properties } = await listProperties({
        userId: session.user.id as number,
        approvalStatus: "ALL",
        limit: 1000,
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "PENDING_REVIEW": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "DECLINED": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    const formatPrice = (price: any) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(price);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Properties</h1>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm overflow-hidden">
                {properties.length === 0 ? (
                    <div className="p-6 text-center py-12">
                        <p className="text-muted-foreground">No properties found.</p>
                        <Link href="/advertise" className="text-primary hover:underline mt-2 inline-block">
                            Start your first listing &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3">Property</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map((property: any) => (
                                    <tr key={property.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-24 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {(() => {
                                                        const coverImage = property.mediaUsages?.find((mu: any) => mu.role === "COVER")?.media || property.mediaUsages?.[0]?.media || property.images?.[0];
                                                        return coverImage?.url ? (
                                                            <Image
                                                                src={coverImage.url}
                                                                alt={property.title}
                                                                fill
                                                                sizes="96px"
                                                                className="object-fill"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <Eye className="w-6 h-6" />
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{property.title}</div>
                                                    <div className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-3 h-3" />
                                                        {property.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {formatPrice(property.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" className={`font-normal ${getStatusColor(property.status)}`}>
                                                {property.status.replace("_", " ")}
                                            </Badge>
                                            {property.status === "DECLINED" && property.declinedReason && (
                                                <div className="text-xs text-red-500 mt-1 max-w-[200px] truncate" title={property.declinedReason}>
                                                    Reason: {property.declinedReason}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(property.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/properties/${property.slug}`} target="_blank">
                                                    <Button variant="ghost" size="icon" title="View Public Listing">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/account/properties/${property.id}/edit`}>
                                                    <Button variant="outline" size="sm" className="h-8 gap-2">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

import { getDevelopers } from "@/modules/admin/actions/developer.actions";
import { DeveloperStatus } from "@prisma/client";
import PageHeader from "@/components/dashboard/PageHeader";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeveloperActions } from "@/modules/admin/components/DeveloperActions";

// export default async function AdminDevelopersPage({
//     searchParams,
// }: {
//     searchParams: { status?: string };
// }) {
//     const statusFilter = searchParams.status
//         ? (searchParams.status.toUpperCase() as DeveloperStatus)
//         : undefined;

//     const developers = await getDevelopers(statusFilter);

//     return (
//         <div className="space-y-6">
//             <PageHeader
//                 heading="Developers"
//                 text="Manage property developers and proposals."
//             />

//             <div className="border rounded-lg bg-card">
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Name</TableHead>
//                             <TableHead>Status</TableHead>
//                             <TableHead>Created At</TableHead>
//                             <TableHead className="text-right">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {developers.length === 0 ? (
//                             <TableRow>
//                                 <TableCell colSpan={4} className="h-24 text-center">
//                                     No developers found.
//                                 </TableCell>
//                             </TableRow>
//                         ) : (
//                             developers.map((dev) => (
//                                 <TableRow key={dev.id}>
//                                     <TableCell className="font-medium">
//                                         {dev.name}
//                                         {dev.createdById && (
//                                             <span className="block text-xs text-muted-foreground">Proposed by User Id #{dev.createdById}</span>
//                                         )}
//                                     </TableCell>
//                                     <TableCell>
//                                         <StatusBadge status={dev.status} />
//                                     </TableCell>
//                                     <TableCell>
//                                         {new Date(dev.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
//                                     </TableCell>
//                                     <TableCell className="text-right">
//                                         {dev.status === "PENDING" && (
//                                             <DeveloperActions developerId={dev.id} />
//                                         )}
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>
//         </div>
//     );
// }

function StatusBadge({ status }: { status: DeveloperStatus }) {
    const variants = {
        PENDING: "bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-yellow-500/20",
        APPROVED: "bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20",
        DECLINED: "bg-red-500/15 text-red-600 hover:bg-red-500/25 border-red-500/20",
    };

    return (
        <Badge variant="outline" className={variants[status]}>
            {status}
        </Badge>
    );
}



export default async function AdminDevelopersPage({
    searchParams,
}: {
    searchParams: { status?: string };
}) {
    const statusFilter = searchParams.status
        ? (searchParams.status.toUpperCase() as DeveloperStatus)
        : undefined;

    const developers = await getDevelopers(statusFilter);
    return <h1>This was having some build issues fix later</h1>
}
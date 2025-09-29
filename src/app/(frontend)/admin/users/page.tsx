// users/page.tsx
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export default function UsersPage() {
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Users</h1>
                <Button>Add User</Button>
            </div>
            <Card className="p-4">
                {/* TODO: Add table here */}
                User Table Placeholder
            </Card>
        </div>
    );
}

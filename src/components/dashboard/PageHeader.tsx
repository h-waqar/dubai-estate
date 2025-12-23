import { cn } from "@/lib/utils";

interface PageHeaderProps {
    heading: string;
    text?: string;
    children?: React.ReactNode;
    className?: string;
}

export default function PageHeader({
    heading,
    text,
    children,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between space-y-2", className)}>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{heading}</h1>
                {text && <p className="text-muted-foreground">{text}</p>}
            </div>
            <div className="flex items-center space-x-2">{children}</div>
        </div>
    );
}

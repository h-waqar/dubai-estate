const FormLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-sm font-semibold text-foreground mb-2.5 tracking-tight">
    {children}
    {required && (
      <span className="text-red-500 ml-1 font-bold" aria-label="required">
        *
      </span>
    )}
  </label>
);

const FieldWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="group relative">{children}</div>
);

const InputIcon = ({ icon: Icon }: { icon: any }) => (
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none">
    <Icon className="w-4 h-4" />
  </div>
);

export { FormLabel, FieldWrapper, InputIcon };

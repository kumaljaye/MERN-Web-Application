'use client';

import FormDialog from '@/components/customUi/dialog-box';
import { Button } from '@/components/ui/button';
import { User } from '../table-column/UserColumns';

interface ViewUserProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  user: User;
}

const ViewUser = ({ open = false, onOpenChange, user }: ViewUserProps) => {
  // Define user fields for display
  const userFields = [
    { label: 'User ID', key: 'userId' as keyof User },
    { label: 'First Name', key: 'firstName' as keyof User },
    { label: 'Last Name', key: 'lastName' as keyof User },
    { label: 'Email', key: 'email' as keyof User },
    { label: 'Birthdate', key: 'birthDate' as keyof User },
    { label: 'Gender', key: 'gender' as keyof User },
  ];

  return (
    <FormDialog
      label="User Details"
      title="View User"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-3">
        {userFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium ">
              {field.label}
            </label>
            <div className="rounded-md border bg-muted p-3">
              {user[field.key]}
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Close
          </Button>
        </div>
      </div>
    </FormDialog>
  );
};

export default ViewUser;

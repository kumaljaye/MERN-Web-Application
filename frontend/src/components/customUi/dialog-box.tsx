'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import DialogHeader from './dialog-header';

interface CardWrapperProps {
  label: string;
  title: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FormDialog = ({
  label,
  title,
  children,
  open = false,
  onOpenChange,
}: CardWrapperProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-[525px]">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <DialogHeader label={label} title={title} />
          </CardHeader>

          <CardContent className="space-y-4">
            {children && children}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;

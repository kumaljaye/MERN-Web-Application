
import { useEffect, useState } from "react"
import { createUserColumns, User } from "./table-column/UserColumns"
import { DataTable } from "../../components/data-table/data-table"
import { DataTableFilter } from "@/components/data-table/data-table-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Button } from "@/components/ui/button"
import { useUsers } from "@/hooks/useUser"
import ViewUser from "./model/ViewUser"
import DeleteConfirmDialog from "../../components/customUi/DeleteConfirmDialog"
import UserForm from "@/pages/users/forms/UserForm"
import { useDeleteUser } from "@/hooks/useUserMutations"
import { PaginationState } from "@tanstack/react-table"

export default function UsersPage() {

  const [isFormOpen, setIsFormOpen] = useState(false)
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })
    const { data: usersResponse, isLoading, error } = useUsers({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    })
    const users = (usersResponse as any)?.users ?? []
    const totalPages = (usersResponse as any)?.pagination?.totalPages ?? 1
    
    console.log('👥 Users:', {
      currentPage: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      totalPages,
      usersCount: users.length,
      isLoading
    })

    // Reset to first page when page size changes
    const handlePaginationChange = (updater: any) => {
      console.log('📄 Users pagination change triggered')
      setPagination((prev) => {
        const newState = typeof updater === 'function' ? updater(prev) : updater
        console.log('📄 Users:', prev.pageIndex + 1, '→', newState.pageIndex + 1, '| Size:', prev.pageSize, '→', newState.pageSize)
        // If page size changed, reset to first page
        if (newState.pageSize !== prev.pageSize) {
          console.log('Page size changed, resetting to page 0')
          return { ...newState, pageIndex: 0 }
        }
        return newState
      })
    }

    useEffect(() => {
      const maxPageIndex = Math.max(totalPages - 1, 0)
      if (pagination.pageIndex > maxPageIndex && totalPages > 0) {
        console.log('Clamping page index from', pagination.pageIndex, 'to', maxPageIndex)
        setPagination((prev) => ({ ...prev, pageIndex: maxPageIndex }))
      }
    }, [totalPages]) // Remove pagination.pageIndex to prevent infinite loops
    const [viewUser, setViewUser] = useState(false)
    const [editUser, setEditUser] = useState(false)
    const [deleteUser, setDeleteUser] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
    // React Query mutation for deleting users
    const deleteUserMutation = useDeleteUser();
  
    // Handle view user click
    const handleViewClick = (user: User) => {
      console.log("Viewing user:", user)
      setSelectedUser(user)
      setViewUser(true)
    }
  
    // Handle edit user click
    const handleEditClick = (user: User) => {
      console.log("Editing user:", user)
      setSelectedUser(user)
      setEditUser(true)
    }
  
    // Handle delete user click
    const handleDeleteClick = (user: User) => {
      console.log("Deleting user:", user)
      setSelectedUser(user)
      setDeleteUser(true)
    }
  
    // Handle view user dialog close
    const handleViewUserClose = (open: boolean) => {
      setViewUser(open)
      if (!open) {
        setSelectedUser(null)
      }
    }
  
    // Create columns with callbacks
    const columns = createUserColumns(handleViewClick, handleEditClick, handleDeleteClick)
  
    if (isLoading) return <div className="p-10 text-center">Loading users...</div>
    if (error) return <div className="p-10 text-center text-red-500">{error.message}</div>

  return (
    <div className="space-y-6 bg-card rounded-lg p-12 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-2 text-muted-foreground">Manage user accounts from MongoDB</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>Add User</Button>
      </div>


      <DataTable
        columns={columns}
        data={users}
        showPagination={true}
        paginationOptions={{
          pageSizeOptions: [5, 10, 20, 50],
          showFirstLastButtons: true,
          showSelectedRows: true,
        }}
        manualPagination
        pageCount={totalPages}
        paginationState={pagination}
        onPaginationChange={handlePaginationChange}
        toolbar={(table) => (
          <div className="flex items-center w-full space-x-4">
            <DataTableFilter
              table={table}
              columnKey="gender"
              placeholder="Filter by gender..."
              className="max-w-sm"
            />
            <DataTableViewOptions table={table} />
          </div>
        )}
      />

      {isFormOpen && (
        <UserForm
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            // Clear any states when form closes
            if (!open) {
              setSelectedUser(null);
            }
          }}
        />
      )}

      {/* View User Dialog */}
      {viewUser && selectedUser && (
        <ViewUser
          open={viewUser}
          onOpenChange={handleViewUserClose}
          user={selectedUser}
        />
      )}

      {/* Edit User Dialog */}
      {editUser && (
        <UserForm
          open={editUser}
          onOpenChange={(open) => {
            setEditUser(open);
            // Clear selected user when form closes
            if (!open) {
              setSelectedUser(null);
            }
          }}
          user={selectedUser}
        />
      )}

      {/* Delete User Dialog */}
      <DeleteConfirmDialog
        open={deleteUser}
        onOpenChange={setDeleteUser}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user?"
        confirmText="Delete User"
        onConfirm={() => {
          if (selectedUser) {
            // Use React Query mutation to delete user with MongoDB _id
            deleteUserMutation.mutate(selectedUser._id);
          }
          setSelectedUser(null);
          setDeleteUser(false);
        }}
        onCancel={() => {
          setSelectedUser(null);
        }}
      />
    </div>
  )
}
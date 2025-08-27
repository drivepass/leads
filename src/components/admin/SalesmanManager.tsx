import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, User, Users } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

export default function SalesmanManager() {
  const { branches, salesmenByBranch, addSalesman, editSalesman, deleteSalesman } = useAdmin();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [newSalesmanName, setNewSalesmanName] = useState('');
  const [editingSalesman, setEditingSalesman] = useState<{ branch: string; name: string } | null>(null);
  const [editSalesmanName, setEditSalesmanName] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddSalesman = () => {
    if (selectedBranch && newSalesmanName.trim()) {
      addSalesman(selectedBranch, newSalesmanName.trim());
      setNewSalesmanName('');
      setSelectedBranch(null);
      setIsAddDialogOpen(false);
    }
  };

  const handleEditSalesman = () => {
    if (editingSalesman && editSalesmanName.trim()) {
      editSalesman(editingSalesman.branch, editingSalesman.name, editSalesmanName.trim());
      setEditingSalesman(null);
      setEditSalesmanName('');
      setIsEditDialogOpen(false);
    }
  };

  const openAddDialog = (branch: string) => {
    setSelectedBranch(branch);
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (branch: string, salesmanName: string) => {
    setEditingSalesman({ branch, name: salesmanName });
    setEditSalesmanName(salesmanName);
    setIsEditDialogOpen(true);
  };

  const handleDeleteSalesman = (branch: string, salesmanName: string) => {
    deleteSalesman(branch, salesmanName);
  };

  const totalSalesmen = Object.values(salesmenByBranch).reduce((total, salesmen) => total + salesmen.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Salesman Management</h3>
          <p className="text-sm text-gray-600">Manage salesmen for each branch</p>
        </div>
        <div className="text-sm text-gray-600">
          Total Salesmen: <span className="font-semibold">{totalSalesmen}</span>
        </div>
      </div>

      {branches.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches available</h3>
            <p className="text-gray-600 mb-4">Create branches first before adding salesmen.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <Card key={branch}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    {branch}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => openAddDialog(branch)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Salesman
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {salesmenByBranch[branch]?.length > 0 ? (
                    salesmenByBranch[branch].map((salesman) => (
                      <div
                        key={salesman}
                        className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">{salesman}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(branch, salesman)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Salesman</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove "{salesman}" from the {branch} branch?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSalesman(branch, salesman)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No salesmen in this branch</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Salesman Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Salesman to {selectedBranch}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="salesmanName">Salesman Name</Label>
              <Input
                id="salesmanName"
                value={newSalesmanName}
                onChange={(e) => setNewSalesmanName(e.target.value)}
                placeholder="Enter salesman name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSalesman}>Add Salesman</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Salesman Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Salesman</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editSalesmanName">Salesman Name</Label>
              <Input
                id="editSalesmanName"
                value={editSalesmanName}
                onChange={(e) => setEditSalesmanName(e.target.value)}
                placeholder="Enter salesman name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSalesman}>Update Salesman</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { GripVertical, Eye, EyeOff, RotateCcw, Save, Check } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export default function FieldManager() {
  const { availableFields, updateFieldVisibility, updateFieldOrder, resetFieldsToDefault } = useAdmin();
  const [saved, setSaved] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = [...availableFields];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const newOrder = items.map(field => field.id);
    updateFieldOrder(newOrder);
    setSaved(false);
  };

  const toggleFieldVisibility = (fieldId: string) => {
    if (fieldId === 'actions' || fieldId === 'leadJourney') return; // Don't allow hiding essential fields

    const field = availableFields.find(f => f.id === fieldId);
    if (field) {
      updateFieldVisibility(fieldId, !field.enabled);
      setSaved(false);
    }
  };

  const handleSave = () => {
    // Settings are automatically saved to localStorage by AdminContext
    setSaved(true);
    toast.success('Field settings saved successfully!');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetFieldsToDefault();
    setSaved(false);
  };

  // Sort fields by order for display
  const sortedFields = [...availableFields].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Table Field Management</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center gap-2"
              variant={saved ? "default" : "default"}
            >
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Drag fields to reorder them or toggle visibility. Changes affect the leads table immediately.
          </p>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {sortedFields.map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={field.id}
                      index={index}
                      isDragDisabled={field.id === 'actions' || field.id === 'leadJourney'}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center justify-between p-3 border rounded-lg bg-white ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          } ${
                            field.id === 'actions' || field.id === 'leadJourney' 
                              ? 'opacity-75 bg-gray-50' 
                              : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              {...provided.dragHandleProps}
                              className={`cursor-grab active:cursor-grabbing ${
                                field.id === 'actions' || field.id === 'leadJourney'
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
                              }`}
                            >
                              <GripVertical className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="flex items-center gap-2">
                              {field.enabled ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                              <span className="font-medium">{field.label}</span>
                              {(field.id === 'actions' || field.id === 'leadJourney') && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  Always Visible
                                </span>
                              )}
                            </div>
                          </div>
                          <Switch
                            checked={field.enabled}
                            onCheckedChange={() => toggleFieldVisibility(field.id)}
                            disabled={field.id === 'actions' || field.id === 'leadJourney'}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </CardContent>
    </Card>
  );
}
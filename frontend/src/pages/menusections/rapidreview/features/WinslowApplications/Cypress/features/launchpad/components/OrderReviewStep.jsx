import React, { useState, useEffect } from 'react';
import { useOrder } from './OrderContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from './ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from './ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Badge } from './ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { toast } from './ui/use-toast';
import { 
  CalendarIcon, 
  CheckIcon, 
  ClipboardIcon, 
  EditIcon, 
  FileTextIcon,
  SendIcon, 
  UserIcon, 
  UsersIcon
} from 'lucide-react';

const ReviewOrderComponent = () => {
  const { 
    formData, 
    updateFormData, 
    submitOrder, 
    calculateOrderValue, 
    updateField,
    prevStep,
    currentStep
  } = useOrder();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [showPreview, setShowPreview] = useState(false);
  const [sendToTeamModal, setSendToTeamModal] = useState(false);
  const [sendToCustomerModal, setSendToCustomerModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Smith', email: 'john.smith@talossecurity.com', selected: false },
    { id: 2, name: 'Sara Johnson', email: 'sara.johnson@talossecurity.com', selected: false },
    { id: 3, name: 'Michael Chen', email: 'michael.chen@talossecurity.com', selected: false },
    { id: 4, name: 'Alex Rodriguez', email: 'alex.rodriguez@talossecurity.com', selected: false }
  ]);
  const [customerContacts, setCustomerContacts] = useState([
    { id: 1, name: 'David Wilson', email: 'david.wilson@hawkeye.com', selected: true },
    { id: 2, name: 'Maria Garcia', email: 'maria.garcia@hawkeye.com', selected: false }
  ]);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPreview, setOrderPreview] = useState(null);
  
  // Fetch order preview
  useEffect(() => {
    // For demo purposes, we'll simulate this
    // In real implementation, you would call your schema_blueprints.py backend
    const fetchOrderPreview = async () => {
      try {
        // For demo, we'll create a simulated preview based on form data
        const preview = generateOrderPreview();
        setOrderPreview(preview);
      } catch (error) {
        console.error('Error fetching order preview:', error);
        toast({
          title: 'Error Generating Preview',
          description: 'There was a problem generating the order preview.',
          variant: 'destructive'
        });
      }
    };
    
    fetchOrderPreview();
  }, [formData]);
  
  // Function to simulate generating order preview
  const generateOrderPreview = () => {
    // This would be replaced with actual API call to schema_blueprints.py
    return {
      orderNumber: formData.orderDetails.orderNumber || 'SO-2025-001',
      customer: 'Hawkeye, Inc.',
      provider: formData.provider.name || 'Talos Security Systems',
      contractReference: formData.provider.contractNumber || 'K-0587631',
      agreementType: formData.provider.agreementType || 'MSA',
      orderTitle: formData.orderDetails.orderTitle || formData.scope.title || 'Professional Services Order',
      startDate: formData.scope.startDate || '04/01/2025',
      endDate: formData.scope.endDate || '06/30/2025',
      totalValue: calculateOrderValue() || formData.orderDetails.totalValue || 45600,
      currency: formData.orderDetails.currency || 'USD',
      roles: formData.roles.length > 0 ? formData.roles : [
        { title: 'Senior Security Consultant', rate: 200, hours: 160, total: 32000 },
        { title: 'Security Analyst', rate: 170, hours: 80, total: 13600 }
      ],
      deliverables: formData.deliverables.length > 0 ? formData.deliverables : [
        { title: 'Security Assessment Report', description: 'Comprehensive report detailing findings and recommendations', dueDate: '05/15/2025' },
        { title: 'Remediation Plan', description: 'Detailed plan for addressing identified security issues', dueDate: '06/15/2025' }
      ]
    };
  };
  
  // Handle sending to team for review
  const handleSendToTeam = async () => {
    setIsSubmitting(true);
    
    try {
      // For demo, we'll just simulate this
      const selectedTeamMembers = teamMembers.filter(member => member.selected);
      
      setTimeout(() => {
        toast({
          title: 'Order Sent for Team Review',
          description: `Order sent to ${selectedTeamMembers.length} team members for review.`,
          variant: 'default'
        });
        setSendToTeamModal(false);
        setIsSubmitting(false);
        
        // Update the status in context
        updateField('status', 'Team Review');
      }, 1500);
    } catch (error) {
      console.error('Error sending for team review:', error);
      toast({
        title: 'Error',
        description: 'There was a problem sending the order for review.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };
  
  // Handle sending to customer
  const handleSendToCustomer = async () => {
    setIsSubmitting(true);
    
    try {
      // For demo, we'll just simulate this
      const selectedContacts = customerContacts.filter(contact => contact.selected);
      
      setTimeout(() => {
        toast({
          title: 'Order Sent to Customer',
          description: `Order has been sent to ${selectedContacts.length} customer contacts for approval.`,
          variant: 'default'
        });
        setSendToCustomerModal(false);
        setIsSubmitting(false);
        
        // Update the status in context
        updateField('status', 'Customer Review');
      }, 1500);
    } catch (error) {
      console.error('Error sending to customer:', error);
      toast({
        title: 'Error',
        description: 'There was a problem sending the order to the customer.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };
  
  // Toggle team member selection
  const toggleTeamMember = (id) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, selected: !member.selected } : member
      )
    );
  };
  
  // Toggle customer contact selection
  const toggleCustomerContact = (id) => {
    setCustomerContacts(prev => 
      prev.map(contact => 
        contact.id === id ? { ...contact, selected: !contact.selected } : contact
      )
    );
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.orderDetails.currency || 'USD'
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Handle different date formats
    let date;
    if (dateString.includes('/')) {
      const [month, day, year] = dateString.split('/');
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateString);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Render order preview in document format
  const renderOrderPreview = () => {
    if (!orderPreview) return <div>Loading preview...</div>;
    
    return (
      <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg rounded-lg space-y-6 text-gray-800 border-2 border-gray-200">
        <div className="text-center border-b-2 border-gray-200 pb-4">
          <h1 className="text-2xl font-bold mb-1">SERVICE ORDER</h1>
          <h2 className="text-xl">{orderPreview.orderNumber}</h2>
          <p className="text-sm text-gray-500 mt-1">Under Master Services Agreement {orderPreview.contractReference}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 border-b-2 border-gray-200 pb-4">
          <div>
            <h3 className="font-semibold text-gray-600">Customer:</h3>
            <p className="font-bold">{orderPreview.customer}</p>
            <p>One Hawkeye Plaza</p>
            <p>New York, NY 10001</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600">Provider:</h3>
            <p className="font-bold">{orderPreview.provider}</p>
            <p>500 Technology Drive</p>
            <p>San Francisco, CA 94107</p>
          </div>
        </div>
        
        <div className="border-b-2 border-gray-200 pb-4">
          <h3 className="font-semibold text-lg mb-2">Order Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Order Title:</p>
              <p className="font-semibold">{orderPreview.orderTitle}</p>
            </div>
            <div>
              <p className="text-gray-600">Agreement Type:</p>
              <p className="font-semibold">{orderPreview.agreementType}</p>
            </div>
            <div>
              <p className="text-gray-600">Start Date:</p>
              <p className="font-semibold">{formatDate(orderPreview.startDate)}</p>
            </div>
            <div>
              <p className="text-gray-600">End Date:</p>
              <p className="font-semibold">{formatDate(orderPreview.endDate)}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Value:</p>
              <p className="font-semibold">{formatCurrency(orderPreview.totalValue)}</p>
            </div>
          </div>
        </div>
        
        <div className="border-b-2 border-gray-200 pb-4">
          <h3 className="font-semibold text-lg mb-2">Resources and Rates</h3>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-right">Rate</th>
                <th className="px-4 py-2 text-right">Hours</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderPreview.roles.map((role, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2">{role.title}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(role.rate)}/hr</td>
                  <td className="px-4 py-2 text-right">{role.hours}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(role.total || role.rate * role.hours)}</td>
                </tr>
              ))}
              <tr className="border-t border-gray-200 bg-gray-50 font-semibold">
                <td className="px-4 py-2" colSpan={3}>Total</td>
                <td className="px-4 py-2 text-right">{formatCurrency(orderPreview.totalValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="border-b-2 border-gray-200 pb-4">
          <h3 className="font-semibold text-lg mb-2">Deliverables</h3>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Deliverable</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-right">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {orderPreview.deliverables.map((item, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">{item.title}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2 text-right">{formatDate(item.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div>
            <p className="font-semibold">Customer Approval:</p>
            <div className="mt-2 border-b border-gray-400 w-48 h-10"></div>
            <p className="mt-1">Name: __________________________</p>
            <p className="mt-1">Title: __________________________</p>
            <p className="mt-1">Date: __________________________</p>
          </div>
          <div>
            <p className="font-semibold">Provider Approval:</p>
            <div className="mt-2 border-b border-gray-400 w-48 h-10"></div>
            <p className="mt-1">Name: __________________________</p>
            <p className="mt-1">Title: __________________________</p>
            <p className="mt-1">Date: __________________________</p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Review Order</h1>
          <p className="text-gray-500">Review and finalize your service order before submission</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'View Mode' : 'Edit Mode'}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="resources">Resources & Rates</TabsTrigger>
          <TabsTrigger value="preview">Order Preview</TabsTrigger>
        </TabsList>
        
        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review the key information for this service order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-500">Customer</Label>
                  <div className="font-semibold text-lg">Hawkeye, Inc.</div>
                </div>
                <div>
                  <Label className="text-gray-500">Provider</Label>
                  <div className="font-semibold text-lg">{formData.provider.name || "Talos Security Systems"}</div>
                </div>
                <div>
                  <Label className="text-gray-500">Contract Reference</Label>
                  <div className="font-semibold">{formData.provider.contractNumber || "K-0587631"}</div>
                </div>
                <div>
                  <Label className="text-gray-500">Agreement Type</Label>
                  <div className="font-semibold">{formData.provider.agreementType || "MSA"}</div>
                </div>
                <div>
                  <Label className="text-gray-500">Order Title</Label>
                  <div className="font-semibold">{formData.orderDetails.orderTitle || formData.scope.title || "Professional Services Order"}</div>
                </div>
                <div>
                  <Label className="text-gray-500">Total Value</Label>
                  <div className="font-semibold text-lg">{formatCurrency(calculateOrderValue() || formData.orderDetails.totalValue || 45600)}</div>
                </div>
                <div>
                  <Label className="text-gray-500">Start Date</Label>
                  <div className="font-semibold">{formatDate(formData.scope.startDate || "04/01/2025")}</div>
                </div>
                <div>
                  <Label className="text-gray-500">End Date</Label>
                  <div className="font-semibold">{formatDate(formData.scope.endDate || "06/30/2025")}</div>
                </div>
              </div>
              
              <Alert className="mt-6">
                <AlertTitle>Ready for review</AlertTitle>
                <AlertDescription>
                  This order is ready for your review. Check all details in the tabs above, then you can send it for team review or directly to the customer.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <Badge variant="outline" className="mr-2">
                  Draft
                </Badge>
                <span className="text-gray-500 text-sm">Order #{formData.orderDetails.orderNumber || "SO-2025-001"}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSendToTeamModal(true)}>
                  <UsersIcon className="mr-2 h-4 w-4" />
                  Send for Team Review
                </Button>
                <Button onClick={() => setSendToCustomerModal(true)}>
                  <SendIcon className="mr-2 h-4 w-4" />
                  Send to Customer
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Order Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Comprehensive details about the order scope and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Order Title</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.orderDetails.orderTitle || formData.scope.title || ""} 
                      onChange={(e) => updateFormData('orderDetails', { ...formData.orderDetails, orderTitle: e.target.value })}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50">
                      {formData.orderDetails.orderTitle || formData.scope.title || "Professional Services Order"}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label>Scope Description</Label>
                  {isEditing ? (
                    <Textarea 
                      value={formData.scope.description || ""} 
                      onChange={(e) => updateFormData('scope', { ...formData.scope, description: e.target.value })}
                      rows={5}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50 min-h-20">
                      {formData.scope.description || "Provide security assessment and remediation services for Hawkeye's core infrastructure, including vulnerability scanning, penetration testing, and remediation guidance."}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    {isEditing ? (
                      <div className="flex">
                        <Input 
                          type="date" 
                          value={formData.scope.startDate ? new Date(formData.scope.startDate).toISOString().split('T')[0] : "2025-04-01"} 
                          onChange={(e) => updateFormData('scope', { ...formData.scope, startDate: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50 flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                        {formatDate(formData.scope.startDate || "04/01/2025")}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label>End Date</Label>
                    {isEditing ? (
                      <div className="flex">
                        <Input 
                          type="date" 
                          value={formData.scope.endDate ? new Date(formData.scope.endDate).toISOString().split('T')[0] : "2025-06-30"} 
                          onChange={(e) => updateFormData('scope', { ...formData.scope, endDate: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50 flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                        {formatDate(formData.scope.endDate || "06/30/2025")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="assumptions">
                  <AccordionTrigger>Assumptions</AccordionTrigger>
                  <AccordionContent>
                    {isEditing ? (
                      <Textarea 
                        value={formData.scope.assumptions ? formData.scope.assumptions.join('\n') : "Customer will provide timely access to required systems.\nCustomer will assign a dedicated point of contact.\nWork will be performed during normal business hours."}
                        onChange={(e) => updateFormData('scope', { ...formData.scope, assumptions: e.target.value.split('\n') })}
                        rows={5}
                      />
                    ) : (
                      <ul className="list-disc pl-6 space-y-1">
                        {(formData.scope.assumptions || [
                          "Customer will provide timely access to required systems.",
                          "Customer will assign a dedicated point of contact.",
                          "Work will be performed during normal business hours."
                        ]).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="constraints">
                  <AccordionTrigger>Constraints</AccordionTrigger>
                  <AccordionContent>
                    {isEditing ? (
                      <Textarea 
                        value={formData.scope.constraints ? formData.scope.constraints.join('\n') : "Production systems can only be tested during maintenance windows.\nLevel 1 systems require additional approval."}
                        onChange={(e) => updateFormData('scope', { ...formData.scope, constraints: e.target.value.split('\n') })}
                        rows={3}
                      />
                    ) : (
                      <ul className="list-disc pl-6 space-y-1">
                        {(formData.scope.constraints || [
                          "Production systems can only be tested during maintenance windows.",
                          "Level 1 systems require additional approval."
                        ]).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="location">
                  <AccordionTrigger>Work Location</AccordionTrigger>
                  <AccordionContent>
                    {isEditing ? (
                      <Select 
                        value={formData.scope.workType || "Hybrid"} 
                        onValueChange={(value) => updateFormData('scope', { ...formData.scope, workType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Onsite">Onsite</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">
                        {formData.scope.workType || "Hybrid"}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Resources & Rates Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resources and Rates</CardTitle>
              <CardDescription>Selected roles, rates, and deliverables for this order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Selected Roles</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      {isEditing && <TableHead className="w-10"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(formData.roles.length > 0 ? formData.roles : [
                      { id: 1, title: 'Senior Security Consultant', rate: 200, hours: 160, total: 32000 },
                      { id: 2, title: 'Security Analyst', rate: 170, hours: 80, total: 13600 }
                    ]).map((role, index) => (
                      <TableRow key={role.id || index}>
                        <TableCell>{role.title}</TableCell>
                        <TableCell className="text-right">
                          {isEditing ? (
                            <Input 
                              type="number" 
                              value={role.rate} 
                              onChange={(e) => {
                                const newRoles = [...(formData.roles.length > 0 ? formData.roles : [
                                  { id: 1, title: 'Senior Security Consultant', rate: 200, hours: 160, total: 32000 },
                                  { id: 2, title: 'Security Analyst', rate: 170, hours: 80, total: 13600 }
                                ])];
                                newRoles[index].rate = Number(e.target.value);
                                newRoles[index].total = newRoles[index].rate * newRoles[index].hours;
                                updateFormData('roles', newRoles);
                              }}
                              className="w-24 text-right"
                            />
                          ) : (
                            formatCurrency(role.rate) + '/hr'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isEditing ? (
                            <Input 
                              type="number" 
                              value={role.hours} 
                              onChange={(e) => {
                                const newRoles = [...(formData.roles.length > 0 ? formData.roles : [
                                  { id: 1, title: 'Senior Security Consultant', rate: 200, hours: 160, total: 32000 },
                                  { id: 2, title: 'Security Analyst', rate: 170, hours: 80, total: 13600 }
                                ])];
                                newRoles[index].hours = Number(e.target.value);
                                newRoles[index].total = newRoles[index].rate * newRoles[index].hours;
                                updateFormData('roles', newRoles);
                              }}
                              className="w-20 text-right"
                            />
                          ) : (
                            role.hours
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isEditing ? (
                            <Input 
                              readOnly
                              value={formatCurrency(role.total || role.rate * role.hours)}
                              className="w-28 text-right bg-gray-50"
                            />
                          ) : (
                            formatCurrency(role.total || role.rate * role.hours)
                          )}
                        </TableCell>
                        {isEditing && (
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                const newRoles = formData.roles.filter((_, i) => i !== index);
                                updateFormData('roles', newRoles);
                              }}
                            >
                              <span className="sr-only">Remove</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <path d="M18 6L6 18M6 6l12 12"></path>
                              </svg>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold bg-gray-50">
                      <TableCell colSpan={isEditing ? 3 : 3}>Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(calculateOrderValue() || formData.orderDetails.totalValue || 45600)}
                      </TableCell>
                      {isEditing && <TableCell></TableCell>}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Deliverables</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deliverable</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Due Date</TableHead>
                      {isEditing && <TableHead className="w-10"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(formData.deliverables.length > 0 ? formData.deliverables : [
                      { id: 1, title: 'Security Assessment Report', description: 'Comprehensive report detailing findings and recommendations', dueDate: '05/15/2025' },
                      { id: 2, title: 'Remediation Plan', description: 'Detailed plan for addressing identified security issues', dueDate: '06/15/2025' }
                    ]).map((deliverable, index) => (
                      <TableRow key={deliverable.id || index}>
                        <TableCell className="font-medium">
                          {isEditing ? (
                            <Input 
                              value={deliverable.title} 
                              onChange={(e) => {
                                const newDeliverables = [...(formData.deliverables.length > 0 ? formData.deliverables : [
                                  { id: 1, title: 'Security Assessment Report', description: 'Comprehensive report detailing findings and recommendations', dueDate: '05/15/2025' },
                                  { id: 2, title: 'Remediation Plan', description: 'Detailed plan for addressing identified security issues', dueDate: '06/15/2025' }
                                ])];
                                newDeliverables[index].title = e.target.value;
                                updateFormData('deliverables', newDeliverables);
                              }}
                            />
                          ) : (
                            deliverable.title
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Textarea 
                              value={deliverable.description} 
                              onChange={(e) => {
                                const newDeliverables = [...(formData.deliverables.length > 0 ? formData.deliverables : [
                                  { id: 1, title: 'Security Assessment Report', description: 'Comprehensive report detailing findings and recommendations', dueDate: '05/15/2025' },
                                  { id: 2, title: 'Remediation Plan', description: 'Detailed plan for addressing identified security issues', dueDate: '06/15/2025' }
                                ])];
                                newDeliverables[index].description = e.target.value;
                                updateFormData('deliverables', newDeliverables);
                              }}
                              rows={2}
                            />
                          ) : (
                            deliverable.description
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isEditing ? (
                            <Input 
                              type="date" 
                              value={deliverable.dueDate ? new Date(deliverable.dueDate).toISOString().split('T')[0] : ''} 
                              onChange={(e) => {
                                const newDeliverables = [...(formData.deliverables.length > 0 ? formData.deliverables : [
                                  { id: 1, title: 'Security Assessment Report', description: 'Comprehensive report detailing findings and recommendations', dueDate: '05/15/2025' },
                                  { id: 2, title: 'Remediation Plan', description: 'Detailed plan for addressing identified security issues', dueDate: '06/15/2025' }
                                ])];
                                newDeliverables[index].dueDate = e.target.value;
                                updateFormData('deliverables', newDeliverables);
                              }}
                            />
                          ) : (
                            formatDate(deliverable.dueDate)
                          )}
                        </TableCell>
                        {isEditing && (
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                const newDeliverables = formData.deliverables.filter((_, i) => i !== index);
                                updateFormData('deliverables', newDeliverables);
                              }}
                            >
                              <span className="sr-only">Remove</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <path d="M18 6L6 18M6 6l12 12"></path>
                              </svg>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {isEditing && (
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      const newDeliverables = [...(formData.deliverables.length > 0 ? formData.deliverables : [
                        { id: 1, title: 'Security Assessment Report', description: 'Comprehensive report detailing findings and recommendations', dueDate: '05/15/2025' },
                        { id: 2, title: 'Remediation Plan', description: 'Detailed plan for addressing identified security issues', dueDate: '06/15/2025' }
                      ])];
                      newDeliverables.push({
                        id: Date.now(),
                        title: 'New Deliverable',
                        description: 'Description',
                        dueDate: new Date().toISOString().split('T')[0]
                      });
                      updateFormData('deliverables', newDeliverables);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                      <path d="M12 5v14M5 12h14"></path>
                    </svg>
                    Add Deliverable
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Order Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Preview</CardTitle>
              <CardDescription>Preview how the final order document will appear</CardDescription>
            </CardHeader>
            <CardContent>
              {renderOrderPreview()}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2">
                <FileTextIcon className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="mr-2">
                <ClipboardIcon className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </Button>
              <Button onClick={() => setSendToCustomerModal(true)}>
                <SendIcon className="mr-2 h-4 w-4" />
                Send to Customer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Send for Team Review Modal */}
      <Dialog open={sendToTeamModal} onOpenChange={setSendToTeamModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send for Team Review</DialogTitle>
            <DialogDescription>
              Share this order with your team members for review before sending to the customer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Select Team Members</Label>
              <div className="mt-2 space-y-2">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`team-${member.id}`}
                      checked={member.selected}
                      onCheckedChange={() => toggleTeamMember(member.id)}
                    />
                    <label
                      htmlFor={`team-${member.id}`}
                      className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span>{member.name}</span>
                      <span className="text-gray-500">({member.email})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Add a comment (optional)</Label>
              <Textarea
                id="comment"
                placeholder="Please review this order before we send it to the customer..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendToTeamModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendToTeam} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send for Review'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Send to Customer Modal */}
      <Dialog open={sendToCustomerModal} onOpenChange={setSendToCustomerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send to Customer</DialogTitle>
            <DialogDescription>
              This order will be sent to the customer for review and approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Select Customer Contacts</Label>
              <div className="mt-2 space-y-2">
                {customerContacts.map(contact => (
                  <div key={contact.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`contact-${contact.id}`}
                      checked={contact.selected}
                      onCheckedChange={() => toggleCustomerContact(contact.id)}
                    />
                    <label
                      htmlFor={`contact-${contact.id}`}
                      className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span>{contact.name}</span>
                      <span className="text-gray-500">({contact.email})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="customer-message">Message (optional)</Label>
              <Textarea
                id="customer-message"
                placeholder="Please find attached the service order for your review and approval..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
            <Alert className="mt-2">
              <AlertTitle className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Important
              </AlertTitle>
              <AlertDescription>
                Once sent, this order will be converted to a PDF and emailed to the selected contacts. The status will change to "Customer Review".
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendToCustomerModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendToCustomer} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send to Customer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewOrderComponent;

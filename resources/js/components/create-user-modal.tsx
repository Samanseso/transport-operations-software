import { Dialog, DialogFooter, DialogTitle, DialogContent, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { SetStateAction, useState } from 'react';
import { Form } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import { Label } from './ui/label';
import { Input } from './ui/input';
import InputError from './input-error';
import { LoaderCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CreateUserModalProps {
    setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const CreateUserModal = ({ setOpen }: CreateUserModalProps) => {
    const [selectedRole, setSelectedRole] = useState("");

    return (
        <Dialog open={true} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogTitle>Create User Account</DialogTitle>
                <DialogDescription>Please fill in user account and role details.</DialogDescription>

                <Form
                    {...UserController.create.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    onSuccess={() => setOpen(false)}
                >
                    {({ processing, errors }) => (
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="role">Account Role</Label>
                                <Select name="role" value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                                        <SelectItem value="DRIVER">Driver</SelectItem>
                                        <SelectItem value="ADMINISTRATOR">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="e.g. Juan Cruz"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {selectedRole === 'DRIVER' && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="contact_number">Mobile Contact Number</Label>
                                        <Input
                                            id="contact_number"
                                            type="text"
                                            name="contact_number"
                                            placeholder="e.g. 0917-123-4567"
                                        />
                                        <InputError message={errors.contact_number} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="license_number">Driver's License Number</Label>
                                        <Input
                                            id="license_number"
                                            type="text"
                                            name="license_number"
                                            placeholder="e.g. N01-12-345678"
                                        />
                                        <InputError message={errors.license_number} />
                                    </div>
                                </>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <DialogFooter className="mt-2">
                                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-sky-600 font-semibold text-white hover:bg-sky-700">
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateUserModal;
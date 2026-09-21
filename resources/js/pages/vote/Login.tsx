import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface VoterLoginForm {
    student_id: string;
    password: string;
}

export default function VoterLogin() {
    const { data, setData, post, processing, errors, reset } = useForm<VoterLoginForm>({
        student_id: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('vote.login.attempt'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Voter Login"
            description="Enter your student ID and the 6-character password printed on your voting slip"
        >
            <Head title="Vote — Login" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="student_id">Student ID</Label>
                        <Input
                            id="student_id"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            value={data.student_id}
                            onChange={(e) => setData('student_id', e.target.value)}
                            placeholder="e.g. 2023-0001"
                        />
                        <InputError message={errors.student_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Your 6-character password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={3} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in to vote
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}


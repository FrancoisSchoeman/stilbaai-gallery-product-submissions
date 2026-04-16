import Link from 'next/link';
import { getAdminUserList } from '@/lib/actions/admin';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default async function AdminHomePage() {
  const result = await getAdminUserList();

  if (result.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access denied</CardTitle>
          <CardDescription>
            You do not have permission to view this page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-stone-900">
            Admin
          </h1>
          <p className="text-stone-600 mt-1">
            Artists, profiles, and product submissions
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/profile">Artist dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Users</CardTitle>
          <CardDescription>
            Click a row to open profile details and submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead className="text-right">Submissions</TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-stone-500">
                    No users yet
                  </TableCell>
                </TableRow>
              ) : (
                result.users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {!u.profile ? (
                        <span className="text-stone-500">—</span>
                      ) : u.profile.isComplete ? (
                        <span className="text-green-700">Complete</span>
                      ) : (
                        <span className="text-amber-700">Incomplete</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {u.submissionCount}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" asChild>
                        <Link href={`/admin/users/${u.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

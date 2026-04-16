import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminUserDetail } from '@/lib/actions/admin';
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

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const result = await getAdminUserDetail(userId);

  if (result.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access denied</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!result.data) {
    notFound();
  }

  const { user: u, profile, submissions } = result.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">← All users</Link>
        </Button>
      </div>

      <div>
        <h1 className="font-serif text-3xl font-semibold text-stone-900">
          {u.name}
        </h1>
        <p className="text-stone-600 mt-1">{u.email}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Account</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <span className="text-stone-500">Email verified</span>
            <p className="font-medium">{u.emailVerified ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <span className="text-stone-500">Joined</span>
            <p className="font-medium">
              {u.createdAt.toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Profile</CardTitle>
          <CardDescription>
            Banking and ID data — handle according to your privacy policy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!profile ? (
            <p className="text-stone-500 text-sm">No profile on file</p>
          ) : (
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-stone-500">Name</dt>
                <dd className="font-medium">
                  {profile.name} {profile.surname}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Phone</dt>
                <dd className="font-medium">{profile.phone}</dd>
              </div>
              <div>
                <dt className="text-stone-500">ID number</dt>
                <dd className="font-medium">{profile.idNumber}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Profile complete</dt>
                <dd className="font-medium">
                  {profile.isComplete ? 'Yes' : 'No'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-stone-500">Delivery address</dt>
                <dd className="font-medium whitespace-pre-wrap">
                  {profile.deliveryAddress}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Bank</dt>
                <dd className="font-medium">{profile.bankName}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Account holder</dt>
                <dd className="font-medium">{profile.accountHolder}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Account number</dt>
                <dd className="font-medium">{profile.accountNumber}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Branch code</dt>
                <dd className="font-medium">{profile.branchCode}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Submissions</CardTitle>
          <CardDescription>{submissions.length} total</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Exhibition</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>WC ID</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-stone-500">
                    No submissions
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="max-w-[200px] truncate font-medium">
                      {s.title}
                    </TableCell>
                    <TableCell>{s.artistName}</TableCell>
                    <TableCell>{s.exhibitionName ?? '—'}</TableCell>
                    <TableCell className="tabular-nums">{s.sellingPrice}</TableCell>
                    <TableCell className="tabular-nums">{s.artistPayout}</TableCell>
                    <TableCell>{s.status}</TableCell>
                    <TableCell>{s.wcProductId ?? '—'}</TableCell>
                    <TableCell className="whitespace-nowrap text-stone-600">
                      {s.createdAt.toLocaleDateString()}
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

import { auth } from "@/auth";
import { redirect } from 'next/navigation';
import MakeChangeForm from '../../components/MakeChangeForm';

export default async function MakeChange() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }
  return (
    <>
      <MakeChangeForm />
    </>
  );
}

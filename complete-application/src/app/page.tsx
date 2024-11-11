import { auth } from "@/auth"
import Image from 'next/image';
import { redirect } from 'next/navigation';
import LoginLink from '../components/LoginLink';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/account');
  }
  return (
    <main>
      <div style={{ flex: '1' }}>
        <div className="column-container">
          <div className="content-container">
            <div style={{ marginBottom: '100px' }}>
              <h1>Welcome to Changebank</h1>
              <LoginLink session={session} />
            </div>
          </div>
          <div style={{ width: '100%', maxWidth: 800 }}>
            <Image
              src="/img/money.jpg"
              alt="money"
              width={1512}
              height={2016}
              style={{
                objectFit: 'contain',
                width: '100%',
                position: 'relative',
                height: 'unset',
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

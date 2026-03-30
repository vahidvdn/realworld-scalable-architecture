import type { Route } from './+types/home';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import { baseOptions } from '@/lib/layout.shared';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Realworld Scalable Architecture' },
    {
      name: 'description',
      content:
        'Practical insights and patterns for building real-world, scalable, and maintainable software architectures.',
    },
  ];
}

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-br from-fd-background via-fd-background/80 to-fd-primary/10">
        {/* Animated blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {[
            {
              size: 500,
              top: '25%',
              left: '25%',
              color: 'rgba(59, 130, 246, 0.3)',
              delay: '0s',
            },
            {
              size: 400,
              top: '20%',
              left: '60%',
              color: 'rgba(236, 72, 153, 0.3)',
              delay: '2s',
            },
            {
              size: 450,
              top: '65%',
              left: '35%',
              color: 'rgba(34, 197, 94, 0.3)',
              delay: '4s',
            },
          ].map((blob, i) => (
            <div
              key={i}
              style={{
                width: blob.size,
                height: blob.size,
                top: blob.top,
                left: blob.left,
                backgroundColor: blob.color,
                borderRadius: '50%',
                filter: 'blur(100px)',
                position: 'absolute',
                mixBlendMode: 'multiply',
                animation: `blob 18s infinite ease-in-out`,
                animationDelay: blob.delay,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col items-center justify-center text-center z-10">
          <img
            width={85}
            height={85}
            className="mb-18 opacity-90 dark:hidden"
            src="logo.png"
            alt="Fumadocs"
          />
          <img
            width={85}
            height={85}
            className="mb-18 opacity-90 hidden dark:block"
            src="logo-dark.png"
            alt="Fumadocs"
          />
          <h1 className="leading-[1.1] text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-12">
            Real World <br /> Scalable Architecture.
          </h1>
          <p className="text-fd-muted-foreground mb-20 max-w-2xl text-lg font-extralight">
            Practical insights and patterns for building real-world, scalable,
            and maintainable software architectures.
          </p>

          <div className="flex gap-4">
            <Link
              className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-5 py-2.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              to="/docs"
            >
              Open Docs
            </Link>
            <Link
              className="text-sm bg-fd-secondary text-fd-secondary-foreground rounded-full font-medium px-5 py-2.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              to="https://github.com/vahidvdn/realworld-scalable-architecture"
              target="_blank"
            >
              Github
            </Link>
          </div>
          {/* <GithubInfo
            className='mb-2 mt-8'
            owner="vahidvdn"
            repo="realworld-scalable-architecture"
          /> */}
        </div>

        {/* Keyframes */}
        <style>
          {`
            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
          `}
        </style>
      </div>
    </HomeLayout>
  );
}

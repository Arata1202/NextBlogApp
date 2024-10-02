import { UserProfile, SocialIcon } from '@/section/dummy';
import Image from 'next/image';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import styles from '../../FixedSidebar/index.module.css';

export default function Profile() {
  return (
    <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
      {UserProfile.map((item) => (
        <h1
          key={item.profileTitle}
          className={`${styles.profile} text-2xl text-center font-semibold pb-5 flex justify-center`}
        >
          <UserCircleIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          {item.profileTitle}
        </h1>
      ))}
      <div className="mobile">
        {UserProfile.map((item) => (
          <Image
            key={item.imageUrl}
            className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
            src={item.imageUrl}
            alt={item.imageAlt}
            width={250}
            height={250}
            loading="eager"
          />
        ))}
      </div>
      <div className="pc">
        {UserProfile.map((item) => (
          <Image
            key={item.imageUrl}
            className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
            src={item.imageUrl}
            alt={item.imageAlt}
            width={250}
            height={250}
            loading="lazy"
          />
        ))}
      </div>
      {UserProfile.map((item) => (
        <h1
          key={item.profileTitle}
          className="mt-6 text-2xl text-center font-semibold leading-7 tracking-tight text-gray-800"
        >
          <a href={item.profileHref} className="hover:text-blue-500">
            {item.profileName}
          </a>
        </h1>
      ))}
      <ul role="list" className="mt-6 flex justify-center gap-x-6">
        {SocialIcon.map((icon, index) => (
          <li key={index}>
            <a target="blank" href={icon.href} className="text-gray-400 hover:text-blue-500">
              <span className="sr-only">{icon.name}</span>
              <icon.icon className="h-8 w-8" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <div className="text-lg leading-6 text-gray-800 mt-5 flex justify-center">
        <div>
          {UserProfile.map((item, index) => (
            <ul key={index} style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              {item.profileIntroduction.map((intro, introIndex) => (
                <li key={introIndex}>{intro.sentence}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

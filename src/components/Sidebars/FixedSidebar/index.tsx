'use client';

import { Article } from '@/libs/microcms';
import Display from '../../Adsense/Display';
import Search from '../Elements/Search';
import Profile from '../Elements/Profile';
import Category from '../Elements/Category';
import Tag from '../Elements/Tag';
import Archive from '../Elements/Archive';
import Popular from '../Elements/Popular';
import Recent from '../Elements/Recent';

type Props = {
  articles: Article[];
};

export default function FixedSidebar({ articles }: Props) {
  return (
    <>
      <div className="lg:col-span-1 lg:w-full lg:h-full">
        <Search />
        <Profile />
        <div className="FirstAd mt-5">
          <Display slot="8452341403" />
        </div>
        <Category />
        <Tag />
        <div className="FirstAd mt-5">
          <Display slot="9574685533" />
        </div>
        <Archive />
        <Popular />
        <Recent articles={articles} />
      </div>
    </>
  );
}

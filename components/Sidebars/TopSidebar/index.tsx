'use client';

import React from 'react';
import Search from '../Elements/Search';
import Profile from '../Elements/Profile';
import Category from '../Elements/Category';
import News from '../Elements/News';
import Tag from '../Elements/Tag';
import Archive from '../Elements/Archive';
import Popular from '../Elements/Popular';
import Display from '../../Adsense/Display';
// import { OneSignalInitial } from '@/libs/OneSignalInitial';

export default function TopSidebar() {
  return (
    <div className="lg:col-span-1 lg:w-full lg:h-full">
      <div className="sidebar sticky top-0 start-0">
        <Search />
        {/* <OneSignalInitial /> */}
        <Profile />
        <News />
        <Category />
        <Tag />
        <div className="FirstAd mt-5">
          <Display slot="8452341403" />
        </div>
        <Archive />
        <Popular />
      </div>
    </div>
  );
}

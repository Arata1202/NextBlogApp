'use client';

import React from 'react';
import Display from '../../Adsense/Display';
import Search from '../Elements/Search';
import Profile from '../Elements/Profile';
import Category from '../Elements/Category';
import Tag from '../Elements/Tag';
import Archive from '../Elements/Archive';
import Popular from '../Elements/Popular';

export default function TopSidebar() {
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
      </div>
    </>
  );
}

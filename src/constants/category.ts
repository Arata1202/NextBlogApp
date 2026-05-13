import { IoAirplaneOutline } from 'react-icons/io5';
import {
  BookOpenIcon,
  CommandLineIcon,
  AcademicCapIcon,
  SparklesIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

export const CATEGORY_ARR = [
  { name: '大学生活', id: 'university', icon: AcademicCapIcon },
  { name: '社会人生活', id: 'work', icon: BriefcaseIcon },
  { name: 'レジャー', id: 'leisure', icon: SparklesIcon },
  { name: '旅行', id: 'travel', icon: IoAirplaneOutline },
  { name: 'プログラミング', id: 'programming', icon: CommandLineIcon },
  { name: 'ブログ', id: 'blog', icon: BookOpenIcon },
];

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';

interface TabProps {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
}

const Tabs = ({ text, selected, setSelected }: TabProps) => {
  return (
    <Button
      onClick={() => setSelected(text)}
      variant={selected ? 'default' : 'ghost'}
      className={`${
        selected ? 'text-background' : 'text-primary '
      } relative rounded-md px-2 py-1 text-sm font-medium transition-colors`}
    >
      <span className='relative z-10'>{text}</span>
      {selected && (
        <motion.span
          layoutId='tab'
          transition={{ type: 'spring', duration: 0.4 }}
          className='absolute inset-0 z-0 rounded-md bg-primary'
        ></motion.span>
      )}
    </Button>
  );
};

export default Tabs;

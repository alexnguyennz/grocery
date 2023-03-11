import Link from 'next/link';

import { Button, Menu } from '@mantine/core';
import {
  IconApple,
  IconMeat,
  IconFish,
  IconFridge,
  IconBaguette,
  IconTemperatureMinus,
  IconCookie,
  IconGlass,
  IconBottle,
  IconMedicineSyrup,
  IconHome,
  IconBabyBottle,
  IconPaw,
  IconCircleArrowDownFilled,
} from '@tabler/icons-react';

import departments from '@/src/data/departments.json';

function DepartmentIcons({ icon }: { icon: string }) {
  switch (icon) {
    case 'fruit-veg':
      return <IconApple size="24" />;
    case 'meat-poultry':
      return <IconMeat />;
    case 'fish-seafood':
      return <IconFish />;
    case 'fridge-deli':
      return <IconFridge />;
    case 'bakery':
      return <IconBaguette />;
    case 'frozen':
      return <IconTemperatureMinus />;
    case 'pantry':
      return <IconCookie />;
    case 'beer-wine':
      return <IconGlass />;
    case 'drinks':
      return <IconBottle />;
    case 'health-body':
      return <IconMedicineSyrup />;
    case 'household':
      return <IconHome />;
    case 'baby-child':
      return <IconBabyBottle />;
    case 'pet':
      return <IconPaw />;
    default:
      return null;
  }
}

export default function HeaderDepartments() {
  return (
    <>
      <Menu withArrow shadow="md" transition="scale">
        <Menu.Target>
          <Button
            size="md"
            color="cyan.6"
            leftIcon={<IconCircleArrowDownFilled size={20} />}
          >
            Browse
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label className="text-center">Departments</Menu.Label>
          <div className="columns-2 lg:columns-3 gap-0">
            {departments.map((department) => (
              <Menu.Item
                key={department.slug}
                component={Link}
                href={`/shop/browse/${department.slug}`}
                className="hover:no-underline"
                icon={<DepartmentIcons icon={department.slug} />}
              >
                {department.name}
              </Menu.Item>
            ))}
          </div>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}

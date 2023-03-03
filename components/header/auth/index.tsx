/*** STATE ***/
import { useStore } from '@/src/state/store';

import Account from './account';
import Login from './/login';

export default function Auth() {
  /*** STATE ***/
  const { account } = useStore();

  return <div>{account ? <Account /> : <Login />}</div>;
}

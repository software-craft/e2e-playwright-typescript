import { test, expect } from '@playwright/test';
import userSendAuth from '../.playwright/.auth/userSendAuth.json';
import userReceive from '../.playwright/.auth/userReceiveAuth.json';

const testUserSend = test.extend({
  storageState: userSendAuth
});

const testUserReceive = test.extend({
  storageState: userReceive
});


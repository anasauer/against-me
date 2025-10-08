'use client';
import { EventEmitter } from 'events';

// This is a global event emitter to be used for app-wide events.
// It's primarily used for surfacing rich, contextual errors to the user
// during development.

export const errorEmitter = new EventEmitter();

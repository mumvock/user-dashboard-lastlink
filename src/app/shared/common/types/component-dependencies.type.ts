import { Component } from '@angular/core';

export type ComponentDependencies = Pick<Component, 'imports' | 'providers'>;

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FolderModelBaseModel } from './FolderModelBaseModel';

export type PathFolderResponseModel = (FolderModelBaseModel & {
parentPath?: string | null;
readonly path?: string;
});
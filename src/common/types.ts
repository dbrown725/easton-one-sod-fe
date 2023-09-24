import { IonReorderGroupCustomEvent } from "@ionic/core";
import { ItemReorderEventDetail } from "@ionic/react";
import { DocumentNode } from "graphql";

export interface Song {
    id?: number;
    bandName: string;
    songName: string;
    title: string;
    titleHighlighted?: string;
    bandNameHighlighted?: string;
    songNameHighlighted?: string;
    link: string;
    playlist: string;
    message?: string;
    sortOrder?: number;
    createTime?: string;
    modifyTime?: string;
    score?: number;
    songComments?: [SongComment];
    userId?: number;
    userFirstName?: string;
    userLastName?: string;
    userAvatarColor?: string;
    userIsTheSubmitter: boolean;
    privacyOn?: boolean;
}

export interface SongComment {
    id: number;
    songId: number;
    comment: string;
    userId: number;
    userFirstName: string;
    userLastName: string;
    userAvatarColor: string;
    userIsTheSubmitter: boolean;
    createTime: string;
    modifyTime: string;
}

export interface SongResult {
    songs: Song[];
    getMostRecentSongs: Song[];
}

export interface BullpenSongData {
    bullpenSongById: Song;
    getAllBullpenSongs: Song[];
}

export interface SongListProps {
    songs: Song[];
    showScore: boolean;
    showEditButton: boolean;
    showDeleteButton: boolean;
    showId: boolean;
    handleReorder?: ((event: IonReorderGroupCustomEvent<ItemReorderEventDetail>) => void) | undefined;
    deleteCallback?: ((event: React.MouseEvent<HTMLIonIconElement>, song: Song) => void) | undefined;
    editCallback?: ((event: React.MouseEvent<HTMLSpanElement>, song: Song) => void) | undefined;
    closeModalCallback?: () => void;
}

export interface SongFormProps {
    sodInsertCallback: () => void;
    sodUpdateCallback: () => void;
    sodCancelUpdateCallback: () => void;
    bpCallback: () => void;
    song: Song;
    updateSODRequest: boolean | undefined;
}

export interface SubmitProps {
    song?: Song;
    updateSODRequest?: boolean | undefined;
}

export interface ScrollingSongListProps {
    count: number;
    addDataIncrement: number;
    queryDocumentNode: DocumentNode;
    queryDefinitionName: string;
    editCallback?: ((event: React.MouseEvent<HTMLSpanElement>, song: Song) => void) | undefined;
    showEditButton: boolean;
    showDeleteButton: boolean;
}

export interface SearchingForSongsProps {
    editCallback?: ((event: React.MouseEvent<HTMLSpanElement>, song: Song) => void) | undefined;
    showEditButton: boolean;
}

export interface ErrorDisplayProps {
    message: string;
    detail?: string;
}

export interface UserInfo {
    id: number;
    email: string;
    emailPreference: string;
    privacyOn: boolean;
    isEmailVerified: boolean;
    issuer: string;
    firstName: string;
    lastName: string;
    screenName: string;
    avatarColor: string;
}

export interface BandStats {
    bandName: string;
    songCount: number;
}

export interface SongWrapper {
    song: Song;
    displayEditButton: boolean;
}

export interface SongListItemProps {
    songListProps: SongListProps;
    songWrapper: SongWrapper;
    closeModalCallback?: () => void;
}

export interface SongListDesktopProps {
    songListProps: SongListProps;
    songWrapperList: SongWrapper[];
    closeModalCallback?: () => void;
}

export interface CommentModalProps {
    songId: number;
    closeModalCallback?: () => void;
    commentChangedCallback?: (songComments: SongComment[]) => void;
}
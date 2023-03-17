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
    userFirstName?: string;
    userLastName?: string;
    userAvatarColor?: string;
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
    email: string;
    isEmailVerified: boolean;
    issuer: string;
    firstName: string;
    lastName: string;
    screenName: string;
    avatarColor: string;
}

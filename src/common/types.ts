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
    userId?: number;
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
    showId: boolean;
    handleReorder?: ((event: IonReorderGroupCustomEvent<ItemReorderEventDetail>) => void) | undefined;
    deleteCallback?: ((event: React.MouseEvent<HTMLIonIconElement>, song: Song) => void) | undefined;
    editCallback?: ((event: React.MouseEvent<HTMLSpanElement>, song: Song) => void) | undefined;
}

export interface SongFormProps {
    sodCallback: () => void;
    bpCallback: () => void;
    song: Song;
}

export interface SubmitProps {
    song?: Song;
}

export interface ScrollingSongListProps {
    count: number;
    addDataIncrement: number;
    queryDocumentNode: DocumentNode;
    queryDefinitionName: string;
    pageTitleText: string;
}

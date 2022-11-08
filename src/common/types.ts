import { IonReorderGroupCustomEvent } from "@ionic/core";
import { ItemReorderEventDetail } from "@ionic/react";

export interface Song {
    id?: number;
    bandName: string;
    songName: string;
    title: string;
    link: string;
    playlist: string;
    message?: string;
    sortOrder?: number;
    createTime?: string;
    modifyTime?: string;
    score?: number;
    userId?: number;
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
}

export interface SongFormProps {
    sodCallback: () => void
    bpCallback: () => void
    song: Song;
}

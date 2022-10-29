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
}

export interface SongFormProps {
    Callback: () => void
    song: Song;
}

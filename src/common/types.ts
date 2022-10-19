export interface Song {
    id: number;
    bandName: string;
    songName: string;
    title: string;
    link: string;
    message: string;
    sortOrder: number;
    createTime: string;
    modifyTime: string;
    score: number
}

export interface SongResult {
    songs: Song[];
}

export interface BullpenSongData {
    bullpenSongById: Song;
}
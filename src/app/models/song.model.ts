import { Admin } from "./admin.model";
import { User } from "./user.model";

export class Song {
    constructor(
        // public _id: string, // default is '0', server will update this to the Object Id
        public songName: string,
        public releaseDate: Date,
        public artworkUrl: string,
        public spotifyUri: string,
        public artistId: string
        // public __v: Number // default is 0, server will update this
    ) { }
}
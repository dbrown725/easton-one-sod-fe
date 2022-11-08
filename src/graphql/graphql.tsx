import { gql } from "@apollo/client";

export   const UPDATE_BULLPEN_SONG = gql`
            mutation updateBullpenSong($id: ID!, $title: String!, $songName: String!, $bandName: String!, $link: String!, $message: String!, $sortOrder: Int!) {
            updateBullpenSong(
                id: $id
                title: $title
                songName: $songName
                bandName: $bandName
                link: $link
                message: $message
                sortOrder: $sortOrder) 
                {
                id  
                title
                songName
                bandName
                link
                message
                sortOrder
                }
            }
            `;

export    const GET_ALL_BULLPEN_SONGS = gql`
            query GetAllBullPenSongs {
            getAllBullpenSongs(count: 200) {
                id
                bandName
                songName
                title
                link
                message
                sortOrder
                userId
                createTime
                modifyTime
                }
            }
            `;        

export    const GET_MOST_RECENT_SONGS = gql`
            query getMostRecentSongs($count: Int!) {
            getMostRecentSongs(count: $count) {
                id
                bandName
                songName
                title
                link
                message
                sortOrder
                userId
                createTime
                modifyTime
                }
            }
            `;  
            
 export   const INSERT_SOD = gql`
            mutation insertSodSong($title: String!, $songName: String!, $bandName: String!, $link: String!, $message: String!, $playlist: String!, $userId: ID!) {
              insertSodSong(
                title: $title
                songName: $songName
                bandName: $bandName
                link: $link
                message: $message
                playlist: $playlist
                userId: $userId) 
                {
                title
                songName
                bandName
                link
                message
                playlist
                userId
              }
            }
          `;            

 export   const GET_SEARCH_RESULTS = gql`
          query GetSearchResults($searchText: String!) {
            songBySearchText(searchText: $searchText) {
              id
              bandName
              songName
              title
              titleHighlighted
              link
              playlist
              message
              score
            }
          }
          `;          
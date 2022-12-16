import { gql } from "@apollo/client";

export   const ADD_BULLPEN_SONG = gql`
            mutation addBullpenSong($title: String!, $songName: String!, $bandName: String!, $link: String!, $message: String!, $userId: ID!) {
            addBullpenSong(
                title: $title
                songName: $songName
                bandName: $bandName
                link: $link
                message: $message
                userId: $userId) 
                {
                id  
                title
                songName
                bandName
                link
                message
                sortOrder
                userId
                }
            }
            `;

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
              
export   const DELETE_BULLPEN_SONG = gql`
            mutation deleteBullpenSong($id: ID!) {
              deleteBullpenSong(
                id: $id
                ) 
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
                userFirstName
                userLastName
                userAvatarColor
                createTime
                modifyTime
                }
            }
            `;  

export    const GET_SONGS_WITH_ISSUES_COUNT = gql`
            query getSongsWithIssuesCount {
              getSongsWithIssuesCount
            }
            `;

export    const GET_SONGS_WITH_ISSUES = gql`
            query getSongsWithIssues($count: Int!) {
              getSongsWithIssues(count: $count) {
                id
                bandName
                songName
                title
                link
                message
                sortOrder
                userId
                userFirstName
                userLastName
                userAvatarColor
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

  export   const UPDATE_SOD = gql`
          mutation updateSodSong($id: ID!, $title: String!, $songName: String!, $bandName: String!, $link: String!, $playlist: String!, $userId: ID!) {
            updateSodSong(
              id: $id
              title: $title
              songName: $songName
              bandName: $bandName
              link: $link
              playlist: $playlist
              userId: $userId)
              {
              id
              title
              songName
              bandName
              link
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
              bandNameHighlighted
              songNameHighlighted
              link
              playlist
              userId
              userFirstName
              userLastName
              userAvatarColor
              message
              score
            }
          }
          `;          
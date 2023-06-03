import { gql } from "@apollo/client";

export    const GET_USER_INFO = gql`
            query getUserInfo {
              getUserInfo {
                email
                isEmailVerified
                issuer
                firstName
                lastName
                screenName
                avatarColor
              }
            }
            `;

export   const ADD_BULLPEN_SONG = gql`
            mutation addBullpenSong($title: String!, $songName: String!, $bandName: String!, $link: String!, $message: String!) {
            addBullpenSong(
                title: $title
                songName: $songName
                bandName: $bandName
                link: $link
                message: $message)
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
                createTime
                modifyTime
                userIsTheSubmitter
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
                userFirstName
                userLastName
                userAvatarColor
                createTime
                modifyTime
                userIsTheSubmitter
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
                playlist
                message
                sortOrder
                userFirstName
                userLastName
                userAvatarColor
                createTime
                modifyTime
                userIsTheSubmitter
                }
            }
            `;
            
 export   const INSERT_SOD = gql`
            mutation insertSodSong($title: String!, $songName: String!, $bandName: String!, $link: String!, $message: String!, $playlist: String!) {
              insertSodSong(
                title: $title
                songName: $songName
                bandName: $bandName
                link: $link
                message: $message
                playlist: $playlist)
                {
                title
                songName
                bandName
                link
                message
                playlist
              }
            }
          `;

  export   const UPDATE_SOD = gql`
          mutation updateSodSong($id: ID!, $title: String!, $songName: String!, $bandName: String!, $link: String!, $playlist: String!) {
            updateSodSong(
              id: $id
              title: $title
              songName: $songName
              bandName: $bandName
              link: $link
              playlist: $playlist)
              {
              id
              title
              songName
              bandName
              link
              playlist
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
              userFirstName
              userLastName
              userAvatarColor
              message
              score
              createTime
              modifyTime
              userIsTheSubmitter
            }
          }
          `;

export    const GET_BAND_STATS = gql`
    query getBandStats($count: Int!, $userId: ID!) {
      getBandStats(count: $count, userId: $userId) {
        bandName
        songCount
        }
    }
    `;
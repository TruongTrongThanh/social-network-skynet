import PB from '../database'
import { Feed } from '../models/feed'

export interface FeedForm {
  content: string
  groupID?: string
}

export async function getFeed(feedID: string): Promise<Feed> {
  const query = `
    SELECT
      public."Feed".id,
      json_build_object('id', public."User".id, 'fullname', public."User".fullname) AS originalPoster,
      "group",
      content,
      (SELECT vote_state
      FROM public."FeedVote"
      WHERE public."FeedVote".feed_id = public."Feed".id
      ) AS voteState,
      (SELECT COUNT(public."FeedVote".user_id)
      FROM public."FeedVote"
      WHERE public."FeedVote".feed_id = public."Feed".id
        AND public."FeedVote".vote_state = 1
      )
      AS upvote,
      (SELECT COUNT(public."FeedVote".user_id)
      FROM public."FeedVote"
      WHERE public."FeedVote".feed_id = public."Feed".id
        AND public."FeedVote".vote_state = 0
      )
      AS downvote,
      (SELECT COUNT(public."FeedShare".user_id)
      FROM public."FeedShare"
      WHERE public."FeedShare".feed_id = public."Feed".id
      )
      AS share,
      image,
      public."Feed".created_at AS createdAt
    FROM public."Feed"
    INNER JOIN public."User" ON public."User".id = public."Feed".original_poster
  `
  const params = [feedID]
  const res = await PB.query(query, params)
  return res.rows[0] as Feed
}

export async function postFeed(form: FeedForm, userID: string) {
  const query = `
    INSERT INTO public."Feed" (original_poster, "group", content, created_at)
    VALUES ($1, $2, $3, $4);
  `
  const params = [userID, form.groupID, form.content, new Date()]
  await PB.query(query, params)
}

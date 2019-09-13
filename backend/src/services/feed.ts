import PB from '../database'
import { Feed, FeedVote, FeedForm, FeedVoteNumber } from '../models/feed'

export async function getHomeFeeds(userID: string): Promise<Feed[]> {
  const query = `SELECT * FROM get_feeds_from_user($1);`
  const params = [userID]
  const res = await PB.query(query, params)
  return res.rows as Feed[]
}

export async function getFeed(userID: string, feedID: number): Promise<Feed> {
  const query = `SELECT * FROM get_feeds_from_user($1) WHERE id = $2;`
  const params = [userID, feedID]
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

export async function vote(userID: string, form: FeedVote) {
  const query = `
    INSERT INTO public."FeedVote" (user_id, feed_id, vote_state)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, feed_id) DO UPDATE
    SET vote_state = $3;
  `
  const params = [userID, form.feedID, form.voteState]
  await PB.query(query, params)
}

export async function getVote(feedID: number) {
  const query = `SELECT
    (
      SELECT
            COUNT(public."FeedVote".user_id)
      FROM
            public."FeedVote"
      WHERE
            public."FeedVote".feed_id        = $1
            AND public."FeedVote".vote_state = true
    )
    AS upvote
    , (
        SELECT
              COUNT(public."FeedVote".user_id)
        FROM
              public."FeedVote"
        WHERE
              public."FeedVote".feed_id        = $1
              AND public."FeedVote".vote_state = false
    )
    AS downvote
  `
  const params = [feedID]
  const res = await PB.query(query, params)
  return res.rows[0] as FeedVoteNumber
}

export async function getComments(userID: string, feedID: number, offset?: number, limit?: number) {
  // const query = ``
}

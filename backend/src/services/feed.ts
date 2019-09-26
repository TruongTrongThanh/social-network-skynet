import PB from '../database'
import { Feed, FeedVote, FeedForm, FeedVoteNumber, FeedCommentForm, FeedComment, CommentReplyForm } from '../models/feed'

export async function getHomeFeeds(userID: string): Promise<Feed[]> {
  const query = `SELECT * FROM get_feeds_from_user($1);`
  const params = [userID]
  const res = await PB.query(query, params)
  return res.rows
}

export async function getFeed(userID: string, feedID: number): Promise<Feed> {
  const query = `SELECT * FROM get_feed_details($1, $2);`
  const params = [userID, feedID]
  const res = await PB.query(query, params)
  return res.rows[0] as Feed
}

export async function getShareFeeds(userID: string, feedID: number): Promise<Feed[]> {
  const query = `
    SELECT id, "originalPoster", "group"
    FROM get_feeds_from_user($1) WHERE "shareFromFeed"->>'id' = $2::text
  `
  const params = [userID, feedID]
  const res = await PB.query(query, params)
  return res.rows
}

export async function postFeed(form: FeedForm, userID: string): Promise<number> {
  const query = `
    CALL public.create_feed($1, $2, $3, $4, $5, $6, $7, 0)
  `
  const params = [userID, form.groupID, form.content, form.imageURL, new Date(), form.tags, form.shareFromFeedID]
  const res = await PB.query(query, params)
  return res.rows[0].returning_id
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

export async function postComment(userID: string, form: FeedCommentForm): Promise<number> {
  const query = `
    INSERT INTO public."Comment"(
      feed_id, content, user_id, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `
  const params = [form.feedID, form.content, userID, new Date()]
  const res = await PB.query(query, params)
  return res.rows[0].id
}

export async function postReply(userID: string, form: CommentReplyForm): Promise<number> {
  const query = `
    INSERT INTO public."Reply"(
      comment_id, content, user_id, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `
  const params = [form.commentID, form.content, userID, new Date()]
  const res = await PB.query(query, params)
  return res.rows[0].id
}

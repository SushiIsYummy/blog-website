import styles from './VotingWidget.module.css';
import {
  BiUpvote,
  BiSolidUpvote,
  BiDownvote,
  BiSolidDownvote,
} from 'react-icons/bi';
import PropTypes from 'prop-types';
import { useState } from 'react';

const voteOptions = {
  UPVOTE: 'UPVOTE',
  DOWNVOTE: 'DOWNVOTE',
  NEUTRAL: 'NEUTRAL',
};

function VotingWidget({
  initialVoteOption,
  initialUpvotes = 0,
  initialDownvotes = 0,
  iconSize = '25',
  onVote,
}) {
  const upvoteOffset = initialVoteOption === 'UPVOTE' ? -1 : 0;
  const downvoteOffset = initialVoteOption === 'DOWNVOTE' ? -1 : 0;
  const [currentVote, setCurrentVote] = useState(initialVoteOption);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);

  function handleVoteClick(e) {
    let className;

    if (e.target.tagName === 'svg' || e.target.tagName === 'path') {
      const button = e.target.closest('button');
      className = button ? button.className : null;
    } else if (e.target.tagName === 'button') {
      className = e.target.className;
    }

    if (className === styles.upvoteButton) {
      setCurrentVote(voteOptions.UPVOTE);
      setUpvotes(upvotes + 1 + upvoteOffset);
      setDownvotes(downvotes + downvoteOffset);
      onVote && onVote(voteOptions.UPVOTE);
    } else if (className === styles.downvoteButton) {
      setCurrentVote(voteOptions.DOWNVOTE);
      setUpvotes(upvotes + upvoteOffset);
      setDownvotes(downvotes + 1 + downvoteOffset);
      onVote && onVote(voteOptions.DOWNVOTE);
    } else if (
      className === styles.solidUpvoteButton ||
      className === styles.solidDownvoteButton
    ) {
      setCurrentVote(voteOptions.NEUTRAL);
      setUpvotes(upvotes + upvoteOffset);
      setDownvotes(downvotes + downvoteOffset);
      onVote && onVote(voteOptions.NEUTRAL);
    }
  }

  return (
    <div className={styles.votingWidget}>
      {currentVote === voteOptions.UPVOTE ? (
        <div className={styles.upvoteContainer}>
          <button
            className={styles.solidUpvoteButton}
            onClick={handleVoteClick}
          >
            <BiSolidUpvote
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
            ></BiSolidUpvote>
          </button>
          {upvotes !== null && (
            <p className={`${styles.upvoteValue} ${styles.active}`}>
              {upvotes}
            </p>
          )}
        </div>
      ) : (
        <div className={styles.upvoteContainer}>
          <button className={styles.upvoteButton} onClick={handleVoteClick}>
            <BiUpvote
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
            ></BiUpvote>
          </button>
          {upvotes !== null && (
            <p className={`${styles.upvoteValue}`}>{upvotes}</p>
          )}
        </div>
      )}
      {currentVote === voteOptions.DOWNVOTE ? (
        <div className={styles.downvoteContainer}>
          <button
            className={styles.solidDownvoteButton}
            onClick={handleVoteClick}
          >
            <BiSolidDownvote
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
            ></BiSolidDownvote>
          </button>
          {downvotes !== null && (
            <p className={`${styles.downvoteValue} ${styles.active}`}>
              {downvotes}
            </p>
          )}
        </div>
      ) : (
        <div className={styles.downvoteContainer}>
          <button className={styles.downvoteButton} onClick={handleVoteClick}>
            <BiDownvote
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
            ></BiDownvote>
          </button>
          {downvotes !== null && (
            <p className={`${styles.downvoteValue}`}>{downvotes}</p>
          )}
        </div>
      )}
    </div>
  );
}

VotingWidget.propTypes = {
  initialVoteOption: PropTypes.oneOf([
    voteOptions.UPVOTE,
    voteOptions.DOWNVOTE,
    voteOptions.NEUTRAL,
  ]),
  initialDownvotes: PropTypes.number,
  initialUpvotes: PropTypes.number,
  iconSize: PropTypes.number,
  onVote: PropTypes.func,
};

export default VotingWidget;

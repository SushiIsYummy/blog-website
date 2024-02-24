import styles from './VotingWidget.module.css';
import {
  BiUpvote,
  BiSolidUpvote,
  BiDownvote,
  BiSolidDownvote,
} from 'react-icons/bi';
import PropTypes from 'prop-types';

const voteOptions = {
  UPVOTE: 'UPVOTE',
  DOWNVOTE: 'DOWNVOTE',
  NEUTRAL: 'NEUTRAL',
};

function VotingWidget({
  orientation = 'horizontal',
  currentVote,
  setCurrentVote,
  upvotes,
  setUpvotes,
  downvotes,
  setDownvotes,
  iconSize = '25',
}) {
  const upvoteOffset = currentVote === 'UPVOTE' ? -1 : 0;
  const downvoteOffset = currentVote === 'DOWNVOTE' ? -1 : 0;

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
    } else if (className === styles.downvoteButton) {
      setCurrentVote(voteOptions.DOWNVOTE);
      setUpvotes(upvotes + upvoteOffset);
      setDownvotes(downvotes + 1 + downvoteOffset);
    } else if (
      className === styles.solidUpvoteButton ||
      className === styles.solidDownvoteButton
    ) {
      setCurrentVote(voteOptions.NEUTRAL);
      setUpvotes(upvotes + upvoteOffset);
      setDownvotes(downvotes + downvoteOffset);
    }
  }

  return (
    <div
      className={`${styles.votingWidget} ${orientation === 'vertical' ? styles.vertical : ''}`}
    >
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
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  currentVote: PropTypes.oneOf([
    voteOptions.UPVOTE,
    voteOptions.DOWNVOTE,
    voteOptions.NEUTRAL,
  ]),
  setCurrentVote: PropTypes.func,
  downvotes: PropTypes.number,
  setDownvotes: PropTypes.func,
  upvotes: PropTypes.number,
  setUpvotes: PropTypes.func,
  iconSize: PropTypes.number,
};

export default VotingWidget;

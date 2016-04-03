'use strict';

const path = location.pathname;
const ownerName = path.split('/')[1];

document.addEventListener('DOMContentLoaded', () => {
  const details = $(`.vcard-details .vcard-detail`);
  const isProfile = details.length > 0;
  if (isProfile) {
    const rhandle = new RegExp(`\\bhttps?:\\/\\/twitter\\.com\\/([A-z0-9_]+)\\b`, 'i');
    const existing = details
      .get()
      .map(el => ({el, matches: rhandle.exec(el.innerText)}))
      .filter(x => x.matches);

    existing.forEach(x => {
      const $el = $(x.el);
      addTwitterProfile(x.matches[1], $el);
      $el.remove();
    });

    if (!existing.length) {
      fetch(`https://get-twitter-username.herokuapp.com/${ownerName}`)
        .then(res => res.text())
        .then(profile => sanitizedTwitterHandle(profile))
        .then(username => {
          if (username) {
            addTwitterProfile(username, details.last());
          }
        });
    }
  }

  function sanitizedTwitterHandle(username) {
    const rhandle = /^[A-z0-9_]+$/;
    const handle = username && username || '';
    return rhandle.test(handle) ? handle : null;
  }

  function addTwitterProfile(username, target) {
    const handle = `@${username}`;
    const url = `https://twitter.com/${username}`;
    // add proper twitter profile link
    target.before(`
      <li class="vcard-detail py-1 css-truncate css-truncate-target">
        <svg aria-hidden="true" class="octicon octicon-mention" height="16" role="img" version="1.1" viewBox="0 0 335 276" width="14"><path d="m302 70a195 195 0 0 1 -299 175 142 142 0 0 0 97 -30 70 70 0 0 1 -58 -47 70 70 0 0 0 31 -2 70 70 0 0 1 -57 -66 70 70 0 0 0 28 5 70 70 0 0 1 -18 -90 195 195 0 0 0 141 72 67 67 0 0 1 116 -62 117 117 0 0 0 43 -17 65 65 0 0 1 -31 38 117 117 0 0 0 39 -11 65 65 0 0 1 -32 35"/></svg>
        <a class="url" href="${url}" rel="nofollow me">${handle}</a>
      </li>
    `);
  }
});

// 我的图书
export const booksAPI = {
  MYBOOK_BOOKS: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/myselfBooks',
  },
  MYBOOK_ADDBOOK: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/addBook',
  },
  MYBOOK_ISCOMMON: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/isCommon',
  },
  MYBOOK_CHAPTERLIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/chapterList',
  },
  MYBOOK_INSERTCHAPTER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/insertChapter',
  },
  MYBOOK_DELETECHAPTER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/deleteChapter',
  },
  MYBOOK_EDITCHAPTER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/editChapter',
  },
  MYBOOK_MOVECHAPTER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/moveChapter',
  },
  MYBOOK_SHAREUSERLIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/shareUserList',
  },
  MYBOOK_PAPERRELATED2BOOK: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/school/book/paperRelated2book',
  },
  MYBOOK_SHAREBOOK: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/shareBook',
  },
  MYBOOK_COMMONUSELIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/commonUseList',
  },
  MYBOOK_CHAPTERQUES2BOX: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/school/book/chapterQues2Box',
  },
  MYBOOK_DELCHAPTERQUES: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/delChapterQues',
  },
  MYBOOK_QUOTETEACHCHAPTER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/quoteTeachChapter',
  },
  MYBOOK_ISHASQUESTIONS: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/isHasQuestions',
  },

  SCHOOLBOOK_CHAPERTQUES: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/school/book/chapertQues',
  },
  SCHOOLBOOK_CHAPTERS: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/school/book/chapters',
  },
  SCHOOLBOOK_WISDOMBOOKAPPLY: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/school/service/wisdomBookApply',
  },
}

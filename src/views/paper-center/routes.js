const PaperCenter = (r) =>
    require.ensure([], () => r(require('./paper-center')), 'PaperCenter')
const SyncPapers = (r) =>
    require.ensure([], () => r(require('./children/sync-papers')), 'PaperCenter')
const PreparePapers = (r) =>
    require.ensure([], () => r(require('./children/prepare-papers')), 'PaperCenter')
const StagePapers = (r) =>
    require.ensure([], () => r(require('./children/stage-papers')), 'PaperCenter')
export default [
    {
        path: 'paper/center/syncPapers',
        name: 'paperCenter',
        component: PaperCenter,
    }
]

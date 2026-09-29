/** Règles d'architecture vérifiées par `npm run depcruise` (fitness functions). */
module.exports = {
  forbidden: [
    {
      name: 'pas-de-cycle',
      comment: 'Un cycle de dépendances empêche de comprendre, tester et extraire un module.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'pas-d-infra-d-un-autre-module',
      comment: "Un module n'utilise jamais l'infrastructure (dossier infra/) d'un autre module.",
      severity: 'error',
      from: { path: '^src/([^/]+)/' },
      to: { path: '^src/[^/]+/infra/', pathNot: '^src/$1/' },
    },
    {
      name: 'domaine-pur',
      comment: "Le domaine ne dépend ni de l'infrastructure, ni du framework, ni de la base.",
      severity: 'error',
      from: { path: '^src/[^/]+/domain/' },
      to: { path: ['/infra/', 'node_modules/(@nestjs|pg|amqplib)/'] },
    },
    {
      name: 'ports-sans-infra',
      comment: "Un port est défini dans le langage du domaine : il ne dépend jamais d'un adapter (infra/).",
      severity: 'error',
      from: { path: '^src/[^/]+/ports/' },
      to: { path: '/infra/' },
    },
    {
      name: 'pas-de-code-de-test-en-production',
      severity: 'error',
      from: { path: '^src/' },
      to: { path: '^test/' },
    },
    {
      name: 'pas-d-import-introuvable',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true },
    },

    // ----------------------------------------------------------------------------------
    // TP S3 : ajoutez ici la règle qui traduit la dépendance interdite de votre ADR-003.
    // Modèle :
    // {
    //   name: 'nom-explicite-de-la-regle',
    //   comment: 'Pourquoi cette dépendance est interdite (référence à ADR-003).',
    //   severity: 'error',
    //   from: { path: '^src/module-a/' },
    //   to: { path: '^src/module-b/' },
    // },
    // ----------------------------------------------------------------------------------
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
    },
  },
};

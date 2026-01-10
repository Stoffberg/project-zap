import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Database, Shield, Zap, Radio, RotateCcw } from "lucide-react";

export function LiveDemo() {
  return (
    <section id="demo" className="py-24 px-6 bg-muted/50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 mb-4"
          >
            <Radio className="h-4 w-4" />
            LIVE DEMO
          </motion.span>
          <h2 className="text-4xl font-bold text-foreground md:text-5xl">
            See Convex in Action
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            This demo is live, data syncs in real-time across all visitors. Try opening in multiple tabs!
          </p>
        </motion.div>

        {/* Demo Section - Code + Live Demo */}
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* Code Snippet */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">component.tsx</span>
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code className="text-muted-foreground">
                  <span className="text-violet-500">{"// Define your schema"}</span>{"\n"}
                  {"export default "}<span className="text-amber-500">defineSchema</span>{"({\n"}
                  {"  grid: "}<span className="text-amber-500">defineTable</span>{"({\n"}
                  {"    row: "}<span className="text-emerald-500">v.number</span>{"(),\n"}
                  {"    col: "}<span className="text-emerald-500">v.number</span>{"(),\n"}
                  {"    checked: "}<span className="text-emerald-500">v.boolean</span>{"(),\n"}
                  {"  }),\n"}
                  {"});\n\n"}
                  <span className="text-violet-500">{"// Query - auto-updates in real-time"}</span>{"\n"}
                  <span className="text-blue-500">const</span>{" cells = "}<span className="text-amber-500">useQuery</span>{"(api.grid.get);\n\n"}
                  <span className="text-violet-500">{"// Mutation - syncs to all clients"}</span>{"\n"}
                  <span className="text-blue-500">const</span>{" toggle = "}<span className="text-amber-500">useMutation</span>{"(api.grid.toggle);\n\n"}
                  <span className="text-violet-500">{"// Use it"}</span>{"\n"}
                  {"<"}<span className="text-emerald-500">button</span>{" "}<span className="text-sky-400">onClick</span>{"={() => "}<span className="text-amber-500">toggle</span>{"({ row, col })} />\n"}
                </code>
              </pre>
            </div>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              That's it. No WebSocket setup. No cache invalidation. It just works.
            </p>
          </motion.div>

          {/* Live Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="rounded-lg border border-border bg-card p-8">
              <CheckboxGridDemo />
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {[
            {
              icon: Zap,
              title: "No Polling",
              description: "WebSocket-based real-time updates",
            },
            {
              icon: Database,
              title: "Automatic Caching",
              description: "Smart client-side caching built-in",
            },
            {
              icon: Shield,
              title: "Type-Safe Queries",
              description: "Full TypeScript inference",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                <feature.icon className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const GRID_SIZE = 12;

function CheckboxGridDemo() {
  const checkedCells = useQuery(api.demoGrid.getChecked);

  const toggleCell = useMutation(api.demoGrid.toggleCell).withOptimisticUpdate(
    (localStore, args) => {
      const existingCells = localStore.getQuery(api.demoGrid.getChecked);
      if (existingCells !== undefined) {
        const existingCell = existingCells.find(
          (c) => c.row === args.row && c.col === args.col
        );

        if (existingCell) {
          // Cell exists and is checked, remove it (toggle off)
          localStore.setQuery(
            api.demoGrid.getChecked,
            {},
            existingCells.filter(
              (c) => !(c.row === args.row && c.col === args.col)
            )
          );
        } else {
          // Cell doesn't exist, add it (toggle on)
          const newCell = {
            _id: crypto.randomUUID() as Id<"demoGrid">,
            _creationTime: Date.now(),
            row: args.row,
            col: args.col,
            checked: true,
          };
          localStore.setQuery(api.demoGrid.getChecked, {}, [
            ...existingCells,
            newCell,
          ]);
        }
      }
    }
  );

  const clearAll = useMutation(api.demoGrid.clearAll).withOptimisticUpdate(
    (localStore) => {
      const existingCells = localStore.getQuery(api.demoGrid.getChecked);
      if (existingCells !== undefined) {
        localStore.setQuery(api.demoGrid.getChecked, {}, []);
      }
    }
  );

  // Create a Set of checked positions for fast lookup
  const checkedSet = new Set(
    checkedCells?.map((cell) => `${cell.row}-${cell.col}`) ?? []
  );

  const isLoading = checkedCells === undefined;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-card-foreground">Shared Canvas</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Click any cell, changes sync instantly
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => clearAll()}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
          <div className="flex items-center gap-2 rounded-md bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Live</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
          </div>
        )}

        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const row = Math.floor(index / GRID_SIZE);
            const col = index % GRID_SIZE;
            const isChecked = checkedSet.has(`${row}-${col}`);

            return (
              <motion.button
                key={`${row}-${col}`}
                onClick={() => toggleCell({ row, col })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-md border-2 transition-colors ${
                  isChecked
                    ? "border-violet-600 bg-violet-600"
                    : "border-border bg-muted hover:border-violet-400"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {checkedCells?.length ?? 0} of {GRID_SIZE * GRID_SIZE} cells filled
      </div>
    </div>
  );
}

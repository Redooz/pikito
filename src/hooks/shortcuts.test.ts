import { describe, expect, it, vi } from 'vitest'
import { handleKey, isTypingTarget, type ShortcutActions } from './shortcuts'

interface FakeKeyEvent {
  key: string
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  target: unknown
  preventDefault: ReturnType<typeof vi.fn>
}

function keyEvent(opts: Partial<FakeKeyEvent> = {}): KeyboardEvent {
  return {
    key: '',
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    target: null,
    preventDefault: vi.fn(),
    ...opts,
  } as unknown as KeyboardEvent
}

function actions(partial: Partial<ShortcutActions> = {}): ShortcutActions {
  return {
    onPicker: vi.fn(),
    remove: vi.fn(),
    duplicate: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    getSelection: vi.fn(() => ['n1', 'n2']),
    ...partial,
  }
}

describe('isTypingTarget', () => {
  it('detects input, textarea and contenteditable targets', () => {
    const input = { tagName: 'INPUT', isContentEditable: false }
    const textarea = { tagName: 'TEXTAREA', isContentEditable: false }
    const editable = { tagName: 'DIV', isContentEditable: true }
    const pane = { tagName: 'DIV', isContentEditable: false }
    expect(isTypingTarget(input)).toBe(true)
    expect(isTypingTarget(textarea)).toBe(true)
    expect(isTypingTarget(editable)).toBe(true)
    expect(isTypingTarget(pane)).toBe(false)
    expect(isTypingTarget(null)).toBe(false)
  })
})

describe('handleKey', () => {
  it('opens the picker on Ctrl+K when not typing', () => {
    const a = actions()
    handleKey(keyEvent({ ctrlKey: true, key: 'k' }), a)
    expect(a.onPicker).toHaveBeenCalledOnce()
  })

  it('opens the picker on Cmd(Meta)+K when not typing', () => {
    const a = actions()
    handleKey(keyEvent({ metaKey: true, key: 'K' }), a)
    expect(a.onPicker).toHaveBeenCalledOnce()
  })

  it('ignores shortcuts while typing in an input', () => {
    const a = actions()
    handleKey(keyEvent({ ctrlKey: true, key: 'k', target: { tagName: 'INPUT', isContentEditable: false } }), a)
    handleKey(keyEvent({ key: 'Delete', target: { tagName: 'TEXTAREA', isContentEditable: false } }), a)
    handleKey(keyEvent({ ctrlKey: true, key: 'z', target: { tagName: 'INPUT', isContentEditable: false } }), a)
    handleKey(keyEvent({ ctrlKey: true, key: 'y', target: { tagName: 'INPUT', isContentEditable: false } }), a)
    handleKey(keyEvent({ ctrlKey: true, key: 'd', target: { tagName: 'INPUT', isContentEditable: false } }), a)
    expect(a.onPicker).not.toHaveBeenCalled()
    expect(a.remove).not.toHaveBeenCalled()
    expect(a.undo).not.toHaveBeenCalled()
    expect(a.redo).not.toHaveBeenCalled()
    expect(a.duplicate).not.toHaveBeenCalled()
  })

  it('prevents default on handled expect-default keys', () => {
    const e = keyEvent({ ctrlKey: true, key: 'k' })
    handleKey(e, actions())
    expect(e.preventDefault).toHaveBeenCalledOnce()
  })

  it('deletes the current selection on Delete', () => {
    const a = actions()
    handleKey(keyEvent({ key: 'Delete' }), a)
    expect(a.remove).toHaveBeenCalledWith(['n1', 'n2'])
  })

  it('deletes the current selection on Backspace', () => {
    const a = actions()
    handleKey(keyEvent({ key: 'Backspace' }), a)
    expect(a.remove).toHaveBeenCalledWith(['n1', 'n2'])
  })

  it('undoes on Ctrl+Z', () => {
    const a = actions()
    handleKey(keyEvent({ ctrlKey: true, key: 'z' }), a)
    expect(a.undo).toHaveBeenCalledOnce()
    expect(a.redo).not.toHaveBeenCalled()
  })

  it('redoes on Ctrl+Shift+Z', () => {
    const a = actions()
    handleKey(keyEvent({ ctrlKey: true, shiftKey: true, key: 'z' }), a)
    expect(a.redo).toHaveBeenCalledOnce()
    expect(a.undo).not.toHaveBeenCalled()
  })

  it('redoes on Ctrl+Y', () => {
    const a = actions()
    handleKey(keyEvent({ ctrlKey: true, key: 'y' }), a)
    expect(a.redo).toHaveBeenCalledOnce()
  })

  it('duplicates the selection on Ctrl+D', () => {
    const a = actions()
    handleKey(keyEvent({ ctrlKey: true, key: 'd' }), a)
    expect(a.duplicate).toHaveBeenCalledWith(['n1', 'n2'])
  })

  it('does nothing on unhandled keys', () => {
    const a = actions()
    handleKey(keyEvent({ key: 'a' }), a)
    handleKey(keyEvent({ ctrlKey: true, key: 'p' }), a)
    expect(a.onPicker).not.toHaveBeenCalled()
    expect(a.remove).not.toHaveBeenCalled()
    expect(a.duplicate).not.toHaveBeenCalled()
  })
})
